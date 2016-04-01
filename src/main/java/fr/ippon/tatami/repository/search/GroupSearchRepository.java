package fr.ippon.tatami.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import fr.ippon.tatami.domain.Group;
import java.util.UUID;

public interface GroupSearchRepository extends ElasticsearchRepository<Group, String> {
}
