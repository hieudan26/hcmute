package backend.repositories;

import backend.data.entity.Users;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<Users, String> {
}
