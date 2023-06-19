package backend.cronjob;

import backend.common.TripStatus;
import backend.common.TripType;
import backend.data.entity.Trips;
import backend.repositories.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@EnableScheduling
public class UpdateTripCronJob {
    private final TripRepository tripsRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void updateDataFromDB() {
        log.info("start end status for trips");
        List<Trips> trips = tripsRepository.findAll();
        for(var trip : trips) {
            if(LocalDateTime.now().isAfter(trip.getStartTime())) {
                trip.setType("Adventure");
                tripsRepository.save(trip);
                log.info("update end status for trip with id: "+trip.getId());
            }
        }
    }
}





