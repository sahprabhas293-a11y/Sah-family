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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.sahfamily.office.entity.Department;
import com.sahfamily.office.service.DepartmentService;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    private final DepartmentService departmentService;
    public DepartmentController(DepartmentService departmentService) { this.departmentService = departmentService; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Department create(@Valid @RequestBody Department department) { return departmentService.create(department); }

    @GetMapping
    public List<Department> findAll() { return departmentService.findAll(); }

    @GetMapping("/{id}")
    public Department findById(@PathVariable String id) { return departmentService.findById(id); }

    @PutMapping("/{id}")
    public Department update(@PathVariable String id, @Valid @RequestBody Department department) {
        return departmentService.update(id, department);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) { departmentService.delete(id); }
}
