package fr.ippon.tatami.plugin.api;


public interface StatusUpdateServiceApi {

	public abstract void postStatus(String userToPostAs, String content);
	
//	public abstract void postStatus(String userToPostAs, String content, boolean statusPrivate, Collection<String> attachmentIds);

//	public abstract void postStatusToGroup(String content, String groupId, Collection<String> attachmentIds);
//
//	public abstract void replyToStatus(String content, String replyTo);

}