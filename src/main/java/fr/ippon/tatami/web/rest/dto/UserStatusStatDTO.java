package fr.ippon.tatami.web.rest.dto;


import fr.ippon.tatami.domain.UserStatusStat;

public class UserStatusStatDTO {

    private String email;

    private long statusCount;


    public UserStatusStatDTO(String email, long statusCount){
        this.email = email;
        this.statusCount = statusCount;
    }

    public UserStatusStatDTO(String email){
        this(email,0);
    }

    public UserStatusStatDTO(UserStatusStat userStatusStat) {
        this(userStatusStat.getEmail(),userStatusStat.getStatusCount());
    }

    public String getEmail() { return email;}
    public void setEmail(String email) { this.email = email;}

    public long getStatusCount() { return statusCount; }
    public void setStatusCount(int statusCount) { this.statusCount = statusCount;}

    public String toString(){
        return "UserDTO{" +
            "email='" + email + '\'' +
                ", statusCount='" + statusCount + '\''+
                "}";
    }
}
