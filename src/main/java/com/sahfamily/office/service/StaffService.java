package com.sahfamily.office.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.sahfamily.office.entity.Staff;
import com.sahfamily.office.exception.ResourceNotFoundException;
import com.sahfamily.office.repository.DepartmentRepository;
import com.sahfamily.office.repository.StaffRepository;

@Service
public class StaffService {
    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;

    public StaffService(StaffRepository staffRepository, DepartmentRepository departmentRepository) {
        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
    }

    public Staff create(Staff staff) {
        departmentRepository.findById(staff.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + staff.getDepartmentId()));
        staff.setId(null);
        return staffRepository.save(staff);
    }

    public List<Staff> findAll() { return staffRepository.findAll(); }

    public Staff findById(String id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found: " + id));
    }

    public List<Staff> findByDepartment(String departmentId) {
        departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + departmentId));
        return staffRepository.findByDepartmentId(departmentId);
    }

    public Staff update(String id, Staff input) {
        Staff existing = findById(id);
        departmentRepository.findById(input.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + input.getDepartmentId()));
        existing.setFullName(input.getFullName());
        existing.setEmail(input.getEmail());
        existing.setPhone(input.getPhone());
        existing.setJobTitle(input.getJobTitle());
        existing.setSalary(input.getSalary());
        existing.setDepartmentId(input.getDepartmentId());
        return staffRepository.save(existing);
    }

    public void delete(String id) { staffRepository.delete(findById(id)); }
}
