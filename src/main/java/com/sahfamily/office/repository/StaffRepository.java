package com.sahfamily.office.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.sahfamily.office.entity.Staff;

public interface StaffRepository extends MongoRepository<Staff, String> {
    Optional<Staff> findByEmailIgnoreCase(String email);
    List<Staff> findByDepartmentId(String departmentId);
}
