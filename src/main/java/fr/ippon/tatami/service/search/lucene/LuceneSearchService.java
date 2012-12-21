package fr.ippon.tatami.service.search.lucene;

import fr.ippon.tatami.domain.Group;
import fr.ippon.tatami.domain.SharedStatusInfo;
import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.repository.GroupDetailsRepository;
import fr.ippon.tatami.service.SearchService;
import fr.ippon.tatami.service.util.DomainUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.document.DateTools;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryParser.MultiFieldQueryParser;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.search.*;
import org.apache.lucene.util.Version;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.inject.Inject;
import javax.inject.Named;
import java.io.IOException;
import java.util.*;

public class LuceneSearchService implements SearchService {

    private static final Log log = LogFactory.getLog(LuceneSearchService.class);

    @Inject
    @Named("statusIndexWriter")
    private IndexWriter statusIndexWriter;

    @Inject
    @Named("userIndexWriter")
    private IndexWriter userIndexWriter;

    @Inject
    @Named("groupIndexWriter")
    private IndexWriter groupIndexWriter;

    @Inject
    @Named("statusSearcherManager")
    private SearcherManager statusSearcherManager;

    @Inject
    @Named("userSearcherManager")
    private SearcherManager userSearcherManager;

    @Inject
    @Named("groupSearcherManager")
    private SearcherManager groupSearcherManager;

    @Inject
    private GroupDetailsRepository groupDetailsRepository;

    @Inject
    private Analyzer analyzer;

    private Map<String, Float> statusBoosts = new HashMap<String, Float>();

    @PostConstruct
    public void init() {
        statusBoosts.put("username", 1f);
        statusBoosts.put("content", 5f);
    }

    @PreDestroy
    public void destroy() {
        log.debug("Closing the Lucene index");
        try {
            statusIndexWriter.commit();
            statusIndexWriter.close();
            userIndexWriter.commit();
            userIndexWriter.close();
            groupIndexWriter.commit();
            groupIndexWriter.close();
        } catch (IOException e) {
            log.error("I/O error while closing the Lucene index : " + e.getMessage());
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public boolean reset() {
        log.warn("Trying to delete the complete Lucene index");
        try {
            statusIndexWriter.deleteAll();
            statusIndexWriter.commit();
            userIndexWriter.deleteAll();
            userIndexWriter.commit();
            groupIndexWriter.deleteAll();
            groupIndexWriter.commit();
            return true;
        } catch (IOException e) {
            log.error("I/O error while deleting the Lucene index : " + e.getMessage());
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
            return false;
        }
    }

    @Override
    @Async
    public void addStatus(Status status) {
        try {
            internalAddStatus(status);
            if (log.isDebugEnabled()) {
                log.debug("Lucene indexed status : " + status);
            }
        } catch (IOException e) {
            log.error("The status wasn't added to the index: " + status, e);
        }
    }

    @Override
    public void addStatuses(Collection<Status> statuses) {
        try {
            for (Status status : statuses) {
                internalAddStatus(status);
            }
            statusIndexWriter.commit();
            log.info(statuses.size() + " statuses indexed!");
        } catch (IOException e) {
            log.error("Batch status insert failed ! ", e);
        }
    }

    private void internalAddStatus(Status status) throws IOException {
        Document document = new Document();
        document.add(new Field("domain", status.getDomain(), Field.Store.NO, Field.Index.NOT_ANALYZED));

        if (status.getGroupId() != null) {
            Group group = groupDetailsRepository.getGroupDetails(status.getGroupId());
            if (group.isPublicGroup()) {
                document.add(new Field("publicGroup", "true", Field.Store.NO, Field.Index.NOT_ANALYZED));
            } else {
                document.add(new Field("publicGroup", "false", Field.Store.NO, Field.Index.NOT_ANALYZED));
            }
            document.add(new Field("groupId", status.getGroupId(), Field.Store.NO, Field.Index.NOT_ANALYZED));
        }
        document.add(new Field("statusId", status.getStatusId(), Field.Store.YES, Field.Index.NOT_ANALYZED));
        document.add(new Field("username", status.getUsername(), Field.Store.NO, Field.Index.NOT_ANALYZED));
        document.add(new Field("content", status.getContent(), Field.Store.NO, Field.Index.ANALYZED));
        document.add(new Field("statusDate",
                DateTools.dateToString(status.getStatusDate(), DateTools.Resolution.SECOND),
                Field.Store.NO,
                Field.Index.NOT_ANALYZED));

        statusIndexWriter.addDocument(document);
    }

    @Override
    public void removeStatus(Status status) {
        Term term = new Term("statusId", status.getStatusId());
        try {
            statusIndexWriter.deleteDocuments(term);
            if (log.isDebugEnabled()) {
                log.debug("Lucene deleted status : " + status);
            }
        } catch (IOException e) {
            log.error("Lucene had an I/O error while deleting status " + status + " : " + e.getMessage());
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public Map<String, SharedStatusInfo> searchStatus(String domain,
                                                      String query,
                                                      int page,
                                                      int size) {

        if (page < 0) {
            page = 0; //Default value
        }
        if (size <= 0) {
            size = SearchService.DEFAULT_PAGE_SIZE;
        }
        log.debug("lucene page=" + page);
        IndexSearcher searcher = null;
        try {
            searcher = statusSearcherManager.acquire();
            MultiFieldQueryParser parser =
                    new MultiFieldQueryParser(Version.LUCENE_36,
                            new String[]{"username", "firstName", "lastName", "content"},
                            analyzer,
                            statusBoosts);

            parser.setDateResolution(DateTools.Resolution.SECOND);
            parser.setDefaultOperator(QueryParser.Operator.AND);
            Query luceneQuery = parser.parse(query);
            if (log.isDebugEnabled()) {
                log.debug("Lucene query : " + query);
            }

            TermsFilter filter = new TermsFilter();
            Term domainTerm = new Term("domain", domain);
            filter.addTerm(domainTerm);

            SortField sortField = new SortField("statusDate", SortField.STRING, true);
            Sort sort = new Sort(sortField);

            TopDocs topDocs = searcher.search(luceneQuery, filter, (page + 1) * size, sort);
            int totalHits = topDocs.totalHits;
            if (totalHits == 0) {
                return new HashMap<String, SharedStatusInfo>(0);
            }

            ScoreDoc[] scoreDocArray = topDocs.scoreDocs;
            if (log.isDebugEnabled()) {
                log.debug("Lucene found " + topDocs.totalHits + " results");
            }
            final Map<String, SharedStatusInfo> items = new LinkedHashMap<String, SharedStatusInfo>(size);
            int startItem = page * size;
            int finishItem = (page + 1) * size;
            if (finishItem > scoreDocArray.length) {
                finishItem = scoreDocArray.length;
            }
            for (int i = startItem; i < finishItem; i++) {
                int documentId = scoreDocArray[i].doc;
                Document document = searcher.doc(documentId);
                String statusId = document.get("statusId");
                items.put(statusId, null);
            }
            return items;
        } catch (ParseException e) {
            log.error("A Lucene query could not be parsed : " + e.getMessage());
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        } catch (IOException e) {
            log.error("A Lucene query had a I/O error : " + e.getMessage());
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        } finally {
            try {
                statusSearcherManager.release(searcher);
            } catch (IOException e) {
                log.error("The Lucene searcher could not be given back to the searcherManager pool. " +
                        e.getMessage());

                if (log.isDebugEnabled()) {
                    e.printStackTrace();
                }
            }
        }
        return new HashMap<String, SharedStatusInfo>(0);
    }

    @Override
    @Async
    public void addUser(User user) {
        try {
            internalAddUser(user);
            if (log.isDebugEnabled()) {
                log.debug("Lucene indexed user : " + user);
            }
        } catch (IOException e) {
            log.error("The user wasn't added to the index: " + user, e);
        }
    }

    @Override
    public void addUsers(Collection<User> users) {
        try {
            for (User user : users) {
                internalAddUser(user);
            }
            userIndexWriter.commit();
            log.info(users.size() + " users indexed!");
        } catch (IOException e) {
            log.error("Batch user insert failed ! ", e);
        }
    }

    private void internalAddUser(User user) throws IOException {
        Document document = new Document();
        document.add(new Field("domain", user.getDomain(), Field.Store.NO, Field.Index.NOT_ANALYZED));
        document.add(new Field("login", user.getLogin(), Field.Store.NO, Field.Index.NOT_ANALYZED));
        document.add(new Field("username", user.getUsername(), Field.Store.YES, Field.Index.NOT_ANALYZED));
        userIndexWriter.addDocument(document);
    }

    @Override
    public void removeUser(User user) {
        Term term = new Term("login", user.getLogin());
        try {
            userIndexWriter.deleteDocuments(term);
            if (log.isDebugEnabled()) {
                log.debug("Lucene deleted login : " + user.getLogin());
            }
        } catch (IOException e) {
            log.error("Lucene had an I/O error while deleting user " + user.getLogin() + " : " + e.getMessage());
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        }
    }

    @Override
    @Cacheable("user-prefix-cache")
    public Collection<String> searchUserByPrefix(String domain, String prefix) {
        IndexSearcher searcher = null;
        List<String> logins = new ArrayList<String>();
        try {
            searcher = userSearcherManager.acquire();

            Term prefixTerm = new Term("username", prefix);
            Query luceneQuery = new PrefixQuery(prefixTerm);

            TermsFilter filter = new TermsFilter();
            Term domainTerm = new Term("domain", domain);
            filter.addTerm(domainTerm);

            SortField sortField = new SortField("username", SortField.STRING, true);
            Sort sort = new Sort(sortField);

            TopDocs topDocs = searcher.search(luceneQuery, filter, DEFAULT_TOP_N_SEARCH_USER, sort);
            int totalHits = topDocs.totalHits;
            if (totalHits == 0) {
                return new ArrayList<String>();
            }

            ScoreDoc[] scoreDocArray = topDocs.scoreDocs;
            for (int i = 0; i < scoreDocArray.length; i++) {
                int documentId = scoreDocArray[i].doc;
                Document document = searcher.doc(documentId);
                String username = document.get("username");
                String login = DomainUtil.getLoginFromUsernameAndDomain(username, domain);
                logins.add(login);
                log.debug(login);
            }
        } catch (IOException e) {
            log.error("A Lucene query had a I/O error : " + e.getMessage());
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        } finally {
            try {
                userSearcherManager.release(searcher);
            } catch (IOException e) {
                log.error("The Lucene searcher could not be given back to the searcherManager pool. " +
                        e.getMessage());

                if (log.isDebugEnabled()) {
                    e.printStackTrace();
                }
            }
        }
        return logins;
    }


    @Override
    public void addGroup(Group group) {
        try {
            internalAddGroup(group);
            if (log.isDebugEnabled()) {
                log.debug("Lucene indexed group : " + group);
            }
        } catch (IOException e) {
            log.error("The group wasn't added to the index: " + group, e);
        }
    }

    @Override
    public void removeGroup(Group group) {
        Term term = new Term("groupId", group.getGroupId());
        try {
            userIndexWriter.deleteDocuments(term);
            if (log.isDebugEnabled()) {
                log.debug("Lucene deleted group : " + group.getGroupId());
            }
        } catch (IOException e) {
            log.error("Lucene had an I/O error while deleting group " + group.getGroupId() + " : " + e.getMessage());
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        }
    }

    @Override
    @Cacheable("group-prefix-cache")
    public Collection<Group> searchGroupByPrefix(String domain, String prefix, int size) {
        IndexSearcher searcher = null;
        Collection<Group> groups = new ArrayList<Group>();
        try {
            searcher = groupSearcherManager.acquire();

            Term prefixTerm = new Term("name-not-analyzed", prefix);
            Query luceneQuery = new PrefixQuery(prefixTerm);

            TermsFilter filter = new TermsFilter();
            Term domainTerm = new Term("domain", domain);
            filter.addTerm(domainTerm);

            TopDocs topDocs = searcher.search(luceneQuery, filter, size);
            int totalHits = topDocs.totalHits;
            if (totalHits == 0) {
                return new ArrayList<Group>();
            }

            ScoreDoc[] scoreDocArray = topDocs.scoreDocs;
            for (int i = 0; i < scoreDocArray.length; i++) {
                int documentId = scoreDocArray[i].doc;
                Document document = searcher.doc(documentId);
                String groupId = document.get("groupId");
                Group group = groupDetailsRepository.getGroupDetails(groupId);
                groups.add(group);
            }
        } catch (IOException e) {
            log.error("A Lucene query had a I/O error : " + e.getMessage());
            if (log.isDebugEnabled()) {
                e.printStackTrace();
            }
        } finally {
            try {
                groupSearcherManager.release(searcher);
            } catch (IOException e) {
                log.error("The Lucene searcher could not be given back to the searcherManager pool. " +
                        e.getMessage());

                if (log.isDebugEnabled()) {
                    e.printStackTrace();
                }
            }
        }
        return groups;
    }

    private void internalAddGroup(Group group) throws IOException {
        Document document = new Document();
        document.add(new Field("domain", group.getDomain(), Field.Store.NO, Field.Index.NOT_ANALYZED));
        document.add(new Field("groupId", group.getGroupId(), Field.Store.YES, Field.Index.NOT_ANALYZED));
        document.add(new Field("name-not-analyzed", group.getName().toLowerCase(), Field.Store.YES, Field.Index.NOT_ANALYZED));
        document.add(new Field("name", group.getName(), Field.Store.YES, Field.Index.ANALYZED));
        document.add(new Field("description", group.getDescription(), Field.Store.YES, Field.Index.ANALYZED));
        groupIndexWriter.addDocument(document);
    }
}
