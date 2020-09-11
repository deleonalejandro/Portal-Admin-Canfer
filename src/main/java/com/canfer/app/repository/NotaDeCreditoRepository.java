package com.canfer.app.repository;

import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.canfer.app.model.ComprobanteFiscal.NotaDeCredito;

@Transactional
@Repository
public interface NotaDeCreditoRepository extends ComprobanteFiscalBaseRepository<NotaDeCredito> {

}

