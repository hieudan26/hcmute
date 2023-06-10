package backend.cronjob;

import backend.common.TripStatus;
import backend.data.entity.Trips;
import backend.repositories.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UpdateTripCronJob {
    private final TripRepository tripsRepository;

    @Scheduled(cron = "0 0 0 * * *") // Runs every day at midnight
    public void updateDataFromDB() {
        List<Trips> trips = tripsRepository.findAll();
        for(var trip : trips) {
            if(LocalDateTime.now().isAfter(trip.getEndTime())) {
                trip.setStatus(TripStatus.END.name());
                tripsRepository.save(trip);
            }
        }
        System.out.println("Trip update status succesfully.");
    }
}





