/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package fr.ippon.tatami.test.support;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.directory.server.core.DefaultDirectoryService;
import org.apache.directory.server.core.DirectoryService;
import org.apache.directory.server.core.entry.ServerEntry;
import org.apache.directory.server.core.partition.Partition;
import org.apache.directory.server.core.partition.impl.btree.jdbm.JdbmPartition;
import org.apache.directory.server.ldap.LdapServer;
import org.apache.directory.server.protocol.shared.transport.TcpTransport;
import org.apache.directory.shared.ldap.entry.Entry;
import org.apache.directory.shared.ldap.entry.EntryAttribute;
import org.apache.directory.shared.ldap.entry.Modification;
import org.apache.directory.shared.ldap.entry.ModificationOperation;
import org.apache.directory.shared.ldap.entry.Value;
import org.apache.directory.shared.ldap.entry.client.ClientModification;
import org.apache.directory.shared.ldap.entry.client.DefaultClientAttribute;
import org.apache.directory.shared.ldap.exception.LdapNameNotFoundException;
import org.apache.directory.shared.ldap.ldif.LdifEntry;
import org.apache.directory.shared.ldap.ldif.LdifReader;
import org.apache.directory.shared.ldap.name.LdapDN;
import org.elasticsearch.common.collect.Lists;

/**
 * An embedded ldap test server Based on
 * http://directory.apache.org/apacheds/1.5/41-embedding-apacheds-into-an-application.html
 */
public class LdapTestServer {
    /**
     * The directory service
     */
    private DirectoryService service;

    public DirectoryService getService() {
        return service;
    }

    /**
     * The LDAP server
     */
    private LdapServer server;

    private static File workingDir = new File("target/ldapServer");

    private Partition addPartition(String partitionId, String partitionDn) throws Exception {
        // Create a new partition named 'ippon'.
        Partition partition = new JdbmPartition();
        partition.setId(partitionId);
        partition.setSuffix(partitionDn);
        service.addPartition(partition);

        return partition;
    }

    public void start() throws Exception {
        // Initialize the LDAP service
        service = new DefaultDirectoryService();

        service.setWorkingDirectory(workingDir);

        // Disable the ChangeLog system
        service.getChangeLog().setEnabled(false);
        service.setDenormalizeOpAttrsEnabled(true);

        Partition ipponPartition = addPartition("ippon", "dc=ippon,dc=fr");

        // And start the service
        service.startup();

        // Inject the ippon root entry if it does not already exist
        try {
            service.getAdminSession().lookup(ipponPartition.getSuffixDn());
            System.out.printf("Root %s found ! %n", ipponPartition.getSuffixDn());
        } catch (LdapNameNotFoundException lnnfe) {
            System.out.printf("Root %s not found ! creating it ... %n", ipponPartition.getSuffixDn());

            LdapDN dnippon = new LdapDN("dc=ippon,dc=fr");
            ServerEntry entryippon = service.newEntry(dnippon);
            entryippon.add("objectClass", "top", "domain", "extensibleObject");
            entryippon.add("dc", "ippon");
            service.getAdminSession().add(entryippon);

            System.out.printf("Importing some data ... %n", ipponPartition.getSuffixDn());
            InputStream is = this.getClass().getResource("ipponTestLdapExport.ldif").openStream();
            LdifReader ldifReader = new LdifReader(is);
            for (LdifEntry entry : ldifReader) {
                injectEntry(entry, service);
            }
            is.close();

        }

        // service LDAP :
        server = new LdapServer();
        // int serverPort = 10389;
        int serverPort = 389;
        server.setTransports(new TcpTransport(serverPort));
        server.setDirectoryService(service);

        server.start();
    }

    public void replaceAttribute(String dn, String attName, String value) throws Exception {
        LdapDN ldapDN = new LdapDN(dn);
        EntryAttribute attribute = new DefaultClientAttribute(attName, value);
        Modification m = new ClientModification(ModificationOperation.REPLACE_ATTRIBUTE, attribute);
        List<Modification> l = Lists.newArrayList(m);
        service.getAdminSession().modify(ldapDN, l);
    }

    private static void injectEntry(LdifEntry entry, DirectoryService service) throws Exception {
        if (entry.isChangeAdd()) {
            ServerEntry serverEntry = service.newEntry(entry.getDn());
            for (EntryAttribute entryAttribute : entry.getEntry()) {
                List<Value<?>> allValue = new ArrayList<Value<?>>();
                for (Value<?> value : entryAttribute) {
                    allValue.add(value);
                }
                serverEntry.add(entryAttribute.getId(), allValue.toArray(new Value[0]));
            }
            service.getAdminSession().add(serverEntry);
            // service.getAdminSession().add( new DefaultServerEntry( service.getSchemaManager(), entry.getEntry() ) );
        } else if (entry.isChangeModify()) {
            // not used, not tested ...
            service.getAdminSession().modify(entry.getDn(), entry.getModificationItems());
        } else {
            throw new IllegalArgumentException("bug");
        }
    }

    public void stop() throws Exception {
        server.stop();
        service.shutdown();
    }

    /**
     * Creates a new instance of EmbeddedADS. It initializes the directory service.
     *
     * @throws Exception If something went wrong
     */
    public LdapTestServer() throws Exception {
    }

    /**
     * Main class. We just do a lookup on the server to check that it's available.
     * <p/>
     * FIXME : in Eclipse : when running this classes as "Java Application", target/test-classes is not added in the classpath
     * resulting in a java.lang.ClassNotFoundException ...
     *
     * @param args Not used.
     * @throws Exception
     */
    public static void main(String[] args) throws Exception {
        FileUtils.deleteDirectory(workingDir);

        LdapTestServer ads = null;
        try {
            // Create the server
            ads = new LdapTestServer();
            ads.start();

            // Read an entry
            Entry result = ads.service.getAdminSession().lookup(new LdapDN("dc=ippon,dc=fr"));

            // And print it if available
            System.out.println("Found entry : " + result);

        } catch (Exception e) {
            // Ok, we have something wrong going on ...
            e.printStackTrace();
        }
        System.out.println("Press enter");
        new BufferedReader(new InputStreamReader(System.in)).readLine();
        ads.stop();
    }

}
