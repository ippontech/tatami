/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package fr.ippon.tatami.web.syndic;

import com.sun.syndication.feed.rss.Channel;
import com.sun.syndication.feed.rss.Content;
import com.sun.syndication.feed.rss.Item;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.springframework.web.servlet.view.feed.AbstractRssFeedView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * @author Pierre Rust
 */
public class SyndicView extends AbstractRssFeedView {


    /**
     * @param model
     */
    @Override
    protected void buildFeedMetadata(Map<String, Object> model, Channel feed, HttpServletRequest request) {
        // this is mandatory: a feed with no title is invalid and is not rendered 
        // by the actual view implementation

        String title = (String) model.get("feedTitle");
        String description = (String) model.get("feedDescription");
        String link = (String) model.get("feedLink");

        feed.setTitle(title);
        feed.setDescription(description);
        feed.setLink(link);
        feed.setEncoding("UTF-8");
        super.buildFeedMetadata(model, feed, request);
    }

    @Override
    protected List<Item> buildFeedItems(Map<String, Object> model, HttpServletRequest hsr, HttpServletResponse hsr1) throws Exception {
        @SuppressWarnings("unchecked")
        Collection<StatusDTO> listContent = (Collection<StatusDTO>) model.get("feedContent");
        String statusBaseLink = (String) model.get("statusBaseLink");
        List<Item> items = new ArrayList<Item>(listContent.size());

        for (StatusDTO tempContent : listContent) {

            Item item = new Item();

            String statusText = tempContent.getContent();
            Content content = new Content();
            content.setValue(statusText);
            item.setContent(content);
            StringBuilder linkBuilder = new StringBuilder(statusBaseLink);
            linkBuilder.append(tempContent.getUsername())
                    .append("/#/status/")
                    .append(tempContent.getStatusId());

            item.setTitle(statusText.substring(0, Math.min(30, statusText.length())));
            item.setLink(linkBuilder.toString());
            item.setPubDate(tempContent.getStatusDate());

            items.add(item);
        }

        return items;
    }


}
