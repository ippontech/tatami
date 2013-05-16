package fr.ippon.tatami.domain;

import java.io.Serializable;

public class SharedStatusInfo implements Serializable {

    private final String sharedStatusId;

    private final String originalStatusId;

    private final String sharedByLogin;

    public SharedStatusInfo(String sharedStatusId, String originalStatusId, String sharedByLogin) {
        this.sharedStatusId = sharedStatusId;
        this.originalStatusId = originalStatusId;
        this.sharedByLogin = sharedByLogin;
    }

    public String getSharedStatusId() {
        return sharedStatusId;
    }

    public String getOriginalStatusId() {
        return originalStatusId;
    }

    public String getSharedByLogin() {
        return sharedByLogin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SharedStatusInfo that = (SharedStatusInfo) o;

        return sharedStatusId.equals(that.sharedStatusId);

    }

    @Override
    public int hashCode() {
        return sharedStatusId.hashCode();
    }

    @Override
    public String toString() {
        return "SharedStatusInfo{" +
                "sharedStatusId='" + sharedStatusId + '\'' +
                ", originalStatusId='" + originalStatusId + '\'' +
                ", sharedByLogin='" + sharedByLogin + '\'' +
                '}';
    }
}
