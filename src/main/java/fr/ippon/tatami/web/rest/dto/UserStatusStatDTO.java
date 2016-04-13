package fr.ippon.tatami.web.rest.dto;


import fr.ippon.tatami.domain.UserStatusStat;

public class UserStatusStatDTO {

    private String username;

    private long statusCount;


    public UserStatusStatDTO(String username, long statusCount){
        this.username = username;
        this.statusCount = statusCount;
    }

    public UserStatusStatDTO(String username){
        this(username,0);
    }

    public UserStatusStatDTO(UserStatusStat userStatusStat) {
        this(userStatusStat.getUsername(),userStatusStat.getStatusCount());
    }

    public String getUsername() { return username;}
    public void setUsername(String username) { this.username = username;}

    public long getStatusCount() { return statusCount; }
    public void setStatusCount(int statusCount) { this.statusCount = statusCount;}

    public String toString(){
        return "UserDTO{" +
            "username='" + username + '\'' +
                ", statusCount='" + statusCount + '\''+
                "}";
    }
}
