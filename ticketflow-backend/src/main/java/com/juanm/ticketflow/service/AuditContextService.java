package com.juanm.ticketflow.service;

import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditContextService {

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public void setClientIdentifier(String email) {
        entityManager.createNativeQuery(
                "SELECT set_config('app.current_user_email', :email, false)"
        ).setParameter("email", email).getSingleResult();
    }
}