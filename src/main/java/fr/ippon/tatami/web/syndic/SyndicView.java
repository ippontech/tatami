/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package fr.ippon.tatami.web.syndic;

import com.sun.syndication.feed.rss.Channel;
import com.sun.syndication.feed.rss.Content;
import com.sun.syndication.feed.rss.Item;
import fr.ippon.tatami.service.dto.StatusDTO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.pegdown.PegDownProcessor;
import org.springframework.web.servlet.view.feed.AbstractRssFeedView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * View used to generate the RSS stream corresponding to the timeline
 *
 * @author Pierre Rust
 */
public class SyndicView extends AbstractRssFeedView {


    private final Log log = LogFactory.getLog(SyndicView.class);

    /**
     * @param model
     */
    @Override
    protected void buildFeedMetadata(Map<String, Object> model, Channel feed, HttpServletRequest request) {
        // this is mandatory: a feed with no title is invalid and is not rendered 
        // by the actual view implementation

        String title = (String) model.get("feedTitle");
        if (title == null) {
            title = "This RSS feed does not exist.";
        }
        String description = (String) model.get("feedDescription");
        if (description == null) {
            description = "Either you typed a wrong URL, or the feed was removed by the user to which it belongs.";
        }
        String link = (String) model.get("feedLink");
        if (link == null) {
            link = "";
        }

        feed.setTitle(title);
        feed.setDescription(description);
        feed.setLink(link);
        feed.setEncoding("UTF-8");

        super.buildFeedMetadata(model, feed, request);
    }

    @Override
    protected List<Item> buildFeedItems(Map<String, Object> model, HttpServletRequest hsr, HttpServletResponse hsr1) throws Exception {
        List<Item> items = new ArrayList<Item>();
        Collection<StatusDTO> listContent = (Collection<StatusDTO>) model.get("feedContent");
        if (listContent == null) {
            return items;
        }
        String statusBaseLink = (String) model.get("statusBaseLink");
        for (StatusDTO tempContent : listContent) {

            Item item = new Item();

            String statusText = tempContent.getContent();

            PegDownProcessor processor = new PegDownProcessor();
            String htmlText = processor.markdownToHtml(statusText);
            if (log.isDebugEnabled()) {
                log.debug("feed html content " + htmlText);
            }
            // url handling  for mention & tags
            htmlText = convertLinks(htmlText);

            Content content = new Content();
            content.setType(Content.HTML);
            content.setValue(htmlText);
            item.setContent(content);

            // build link for the status
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


    /**
     * convert #tag and @mention to html links
     *
     * @param htmlText
     * @return html with converted links
     */
    private String convertLinks(String htmlText) {
        // inside status : users (mention) & tags
        // the regexp are converted from tatami customized marked.js
        Pattern p = Pattern.compile("@([A-Za-z0-9!#$%'*+\\/=?\\^_`{|}~\\-]+(?:\\.[A-Za-z0-9!#$%'*+\\/=?\\^_`{|}~\\-]+)*)");
        Matcher m = p.matcher(htmlText);
        StringBuffer mentionSb = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(mentionSb, "<a href='/tatami/profile/$1/' >$0</a>");
        }
        m.appendTail(mentionSb);

        p = Pattern.compile("#([^\\s!\"&#$%'()*+,./:;<=>?@\\\\\\[\\]^_`{|}~-]+(?:\\.[^\\s !\"&#$%'()*+,./:;<=>?@\\\\\\[\\]^_`{|}~-]+)*)");
        m = p.matcher(mentionSb.toString());
        StringBuffer tagSb = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(tagSb, "<a href='/tatami/#/tags/$1' >$0</a>");
        }
        m.appendTail(tagSb);
        return tagSb.toString();
    }


}
