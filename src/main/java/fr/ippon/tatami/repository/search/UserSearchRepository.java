package fr.ippon.tatami.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import fr.ippon.tatami.domain.User;

public interface UserSearchRepository extends ElasticsearchRepository<User, String> {
}
