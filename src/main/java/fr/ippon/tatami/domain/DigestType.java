package fr.ippon.tatami.domain;

/**
 * @author Pierre Rust
 */
public enum DigestType {

    WEEKLY_DIGEST("WEEKLY"),
    DAILY_DIGEST("DAILY");

    /**
     * @param text
     */
    private DigestType(final String text) {
        this.text = text;
    }

    private final String text;

    /* (non-Javadoc)
     * @see java.lang.Enum#toString()
     */
    @Override
    public String toString() {
        return text;
    }

}
