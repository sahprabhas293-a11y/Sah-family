package com.sahfamily.office.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.sahfamily.office.entity.Department;
import com.sahfamily.office.exception.ResourceNotFoundException;
import com.sahfamily.office.repository.DepartmentRepository;
import com.sahfamily.office.repository.StaffRepository;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final StaffRepository staffRepository;

    public DepartmentService(DepartmentRepository departmentRepository, StaffRepository staffRepository) {
        this.departmentRepository = departmentRepository;
        this.staffRepository = staffRepository;
    }

    public Department create(Department department) {
        department.setId(null);
        return departmentRepository.save(department);
    }

    public List<Department> findAll() { return departmentRepository.findAll(); }

    public Department findById(String id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + id));
    }

    public Department update(String id, Department input) {
        Department existing = findById(id);
        existing.setName(input.getName());
        existing.setDescription(input.getDescription());
        existing.setLocation(input.getLocation());
        return departmentRepository.save(existing);
    }

    public void delete(String id) {
        Department existing = findById(id);
        if (!staffRepository.findByDepartmentId(id).isEmpty()) {
            throw new IllegalArgumentException("Cannot delete a department while staff members are assigned to it.");
        }
        departmentRepository.delete(existing);
    }
}
