package fr.ippon.tatami.test.support;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * In Eclipse : when running LdapTestServer as "Java Application", target/test-classes is not added in the classpath
 * resulting in a java.lang.ClassNotFoundException ...
 * This is a workaround ...
 * <p/>
 * Note : this class name does NOT end with *Test (not to be executed by surefire maven plugin)
 */
public class LdapTestServerJunitLauncher {

    @Test
    public void test() throws Exception {
        LdapTestServer.main(null);
    }

}
