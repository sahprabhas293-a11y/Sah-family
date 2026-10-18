package com.sahfamily.office.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.sahfamily.office.entity.Department;

public interface DepartmentRepository extends MongoRepository<Department, String> {
    Optional<Department> findByNameIgnoreCase(String name);
}
