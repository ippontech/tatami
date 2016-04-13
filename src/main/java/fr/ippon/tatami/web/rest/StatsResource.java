package fr.ippon.tatami.web.rest;

import com.codahale.metrics.annotation.Timed;
import fr.ippon.tatami.domain.UserStatusStat;
import fr.ippon.tatami.service.StatsService;
import fr.ippon.tatami.web.rest.dto.UserStatusStatDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.net.URISyntaxException;
import java.util.stream.Collectors;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * REST controller for obtaining statistics.
 */
@RestController
@RequestMapping("/tatami")
public class StatsResource {

    @Inject
    private StatsService statsService;


    @RequestMapping(value = "/rest/stats/day",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<UserStatusStatDTO>> getDayLine() throws URISyntaxException
    {
        Collection<UserStatusStat> stats = statsService.getDayline();
        List<UserStatusStatDTO> userstats = stats.stream()
            .map(UserStatusStatDTO::new)
            .collect(Collectors.toList());
        return new ResponseEntity<>(userstats, HttpStatus.OK);

    }


}
