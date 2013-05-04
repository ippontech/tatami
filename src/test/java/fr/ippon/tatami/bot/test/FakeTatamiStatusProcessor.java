package fr.ippon.tatami.bot.test;

import java.util.ArrayList;
import java.util.List;

import org.apache.camel.Exchange;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import fr.ippon.tatami.bot.processor.TatamiStatusProcessor;

public class FakeTatamiStatusProcessor extends TatamiStatusProcessor {
	
	private static final Log log = LogFactory.getLog(FakeTatamiStatusProcessor.class);

	public List<String> messages = new ArrayList<String>();

	@Override
    public void process(Exchange exchange) throws Exception {
		String status = exchange.getIn().getBody(String.class);
        log.info("Received status : "+status);
		messages.add(status);
    }
	
	
}