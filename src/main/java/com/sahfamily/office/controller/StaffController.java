package com.sahfamily.office.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.sahfamily.office.entity.Staff;
import com.sahfamily.office.service.StaffService;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    private final StaffService staffService;
    public StaffController(StaffService staffService) { this.staffService = staffService; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Staff create(@Valid @RequestBody Staff staff) { return staffService.create(staff); }

    @GetMapping
    public List<Staff> findAll(@RequestParam(required = false) String departmentId) {
        return departmentId == null || departmentId.isBlank()
                ? staffService.findAll() : staffService.findByDepartment(departmentId);
    }

    @GetMapping("/{id}")
    public Staff findById(@PathVariable String id) { return staffService.findById(id); }

    @PutMapping("/{id}")
    public Staff update(@PathVariable String id, @Valid @RequestBody Staff staff) {
        return staffService.update(id, staff);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) { staffService.delete(id); }
}
