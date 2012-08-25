package fr.ippon.tatami.service.lucene;

import fr.ippon.tatami.domain.Status;
import fr.ippon.tatami.domain.User;
import fr.ippon.tatami.service.SearchService;

import java.util.List;
import java.util.Map;

public class LuceneSearchService implements SearchService {

    @Override
    public boolean reset() {
        return false;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public String addStatus(Status status) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public String removeStatus(Status status) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public Map<String, String> search(@SuppressWarnings("rawtypes") String domain, Class clazz, String field, String query, int page, int size, String sortField, String sortOrder) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public <T> List<String> searchPrefix(String domain, Class<T> clazz, String searchField, String uidField, String query, int page, int size) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public String addUser(User user) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
