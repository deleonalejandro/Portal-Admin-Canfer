//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.3.0 
// See <a href="https://javaee.github.io/jaxb-v2/">https://javaee.github.io/jaxb-v2/</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2020.07.16 at 07:11:58 PM CDT 
//


package com.canfer.app.wsdl.invoiceone;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="ValidayVerificaXMLResult" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "validayVerificaXMLResult"
})
@XmlRootElement(name = "ValidayVerificaXMLResponse")
public class ValidayVerificaXMLResponse {

    @XmlElement(name = "ValidayVerificaXMLResult")
    protected String validayVerificaXMLResult;

    /**
     * Gets the value of the validayVerificaXMLResult property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getValidayVerificaXMLResult() {
        return validayVerificaXMLResult;
    }

    /**
     * Sets the value of the validayVerificaXMLResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setValidayVerificaXMLResult(String value) {
        this.validayVerificaXMLResult = value;
    }

}