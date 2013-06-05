package fr.ippon.tatami.domain.status;

/**
 * A status that is shared.
 */
public class Share extends AbstractStatus {

    private String originalStatusId;

    public String getOriginalStatusId() {
        return originalStatusId;
    }

    public void setOriginalStatusId(String originalStatusId) {
        this.originalStatusId = originalStatusId;
    }

    @Override
    public String toString() {
        return "Share{" +
                "originalStatusId='" + originalStatusId + '\'' +
                "} " + super.toString();
    }
}
