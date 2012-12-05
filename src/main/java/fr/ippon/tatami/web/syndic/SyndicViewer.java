/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package fr.ippon.tatami.web.syndic;

import com.sun.syndication.feed.rss.Item;
import com.sun.syndication.feed.rss.Content;

import fr.ippon.tatami.service.dto.StatusDTO;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.view.feed.AbstractRssFeedView;

/**
 *
 * @author tksh1670
 */
public class SyndicViewer  extends AbstractRssFeedView  {

    @Override
    protected List<Item> buildFeedItems(Map<String, Object> model, HttpServletRequest hsr, HttpServletResponse hsr1) throws Exception {
		@SuppressWarnings("unchecked")
		Collection<StatusDTO> listContent = (Collection<StatusDTO>) model.get("feedContent");
		List<Item> items = new ArrayList<Item>(listContent.size());
 
		for(StatusDTO tempContent : listContent ){
 
			Item item = new Item();
 
			Content content = new Content();
			content.setValue(tempContent.getContent());
			item.setContent(content);
 
			item.setTitle(tempContent.getUsername());
			item.setLink("TODO");
			item.setPubDate(tempContent.getStatusDate());
 
			items.add(item);
		}
 
		return items;
        }
    
    
    
}
