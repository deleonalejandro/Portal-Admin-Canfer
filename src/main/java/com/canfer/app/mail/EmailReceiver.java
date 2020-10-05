package com.canfer.app.mail;

import java.util.Properties;

import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.NoSuchProviderException;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.search.FlagTerm;
import javax.persistence.NoResultException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.canfer.app.model.Log;


@Service
public class EmailReceiver {
	
	@Autowired
	private EmailService emailService;
	
	private final String protocol;
	private final String host;
	private final String port;
	private final String userName;
	private final String password;
	
	public EmailReceiver(EmailProperties mailProperties) {
		this.protocol = mailProperties.getReceiveProtocol();
		this.host = mailProperties.getHostname();
		this.port = mailProperties.getPort();
		this.userName = mailProperties.getEmail();
		this.password = mailProperties.getPassword();
	}

	@Async
	public void downloadEmails(Boolean open) {

		try {

			// Include the properties
			Properties properties = getServerProperties();

			// Make session
			Session session = Session.getDefaultInstance(properties);

			// connects to the message store
			Store store = session.getStore(protocol);
			store.connect(userName, password);

			// opens the inbox folder
			Folder folderInbox = store.getFolder("INBOX");
			folderInbox.open(Folder.READ_WRITE);

			// fetches new messages from server
            Flags seen = new Flags(Flags.Flag.SEEN);
            FlagTerm unseenFlagTerm = new FlagTerm(seen,false);
            Message[] messages = folderInbox.search(unseenFlagTerm);
            folderInbox.setFlags(messages, new Flags(Flags.Flag.SEEN), true);
            
            //Processing E-mails
            System.out.println(messages.length);
            
            // just call the method when emails are present
            if (messages.length > 0) {
            	// handle new messages
            	emailService.handleEmails(messages);
			}
            

		} catch (NoSuchProviderException ex) {
			Log.falla("No hay proveedor de correo para el protocolo: " + protocol);
			ex.printStackTrace();

		} catch (MessagingException ex) {
			Log.falla("No se pudo conectar al servicio de mensajeria");
			ex.printStackTrace();

		} catch (NoResultException e) {
			Log.general("Los bandeja fue procesada: " + e.getMessage());
		}
	}
	
	private Properties getServerProperties() {

		// General IMAP configuration for Mail
		Properties properties = new Properties();

		// server setting
		properties.put(String.format("mail.%s.host", protocol), host);
		properties.put(String.format("mail.%s.port", protocol), port);

		// SSL setting
		properties.setProperty(String.format("mail.%s.socketFactory.class", protocol),
				"javax.net.ssl.SSLSocketFactory");
		properties.setProperty(String.format("mail.%s.socketFactory.fallback", protocol), "false");
		properties.setProperty(String.format("mail.%s.socketFactory.port", protocol), String.valueOf(port));

		return properties;
	}
	
}