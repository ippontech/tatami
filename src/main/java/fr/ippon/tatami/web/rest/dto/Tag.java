package fr.ippon.tatami.web.rest.dto;

/**
 * A Tag.
 */
public class Tag {

    private String name;

    /**
     * Default scope is public.
     *
     * A tag can be :
     *   - null -> means "public" as this is the default
     *   - "private" -> this tag is only available to registered members
     */
    private String scope;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Tag tag = (Tag) o;

        if (!name.equals(tag.name)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }

    @Override
    public String toString() {
        return "Tag{" +
                "name='" + name + '\'' +
                ", scope='" + scope + '\'' +
                '}';
    }
}
