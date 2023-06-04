package backend.data.entity;

import backend.common.PostStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.boot.autoconfigure.web.format.DateTimeFormatters;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
public class Posts extends Auditable<String> implements Serializable {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonBackReference
    @JoinColumn(name = "user_id", nullable = false)
    Users owner;

    @Column(nullable = false)
    String type;

    @Column(nullable = false)
    @Lob
    String content;

    @Column(nullable = false)
    @Lob
    String title;

    Boolean isDeleted = false;

    private LocalDateTime time = LocalDateTime.now();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonManagedReference
    Set<PostImages> images = new HashSet<>();


    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Set<Comments> comments = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "react_post",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonManagedReference
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Set<Users> reaction = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "hashtag_post",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "hashtag_id"))
    @JsonManagedReference
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    Set<HashTags> hashTags = new HashSet<>();

    public void addImages(PostImages images) {
        images.setPost(this);
    }

    public void removeImages(PostImages images) {
        images.setPost(null);
        this.images.remove(images);
    }

    public void removeAllImages() {
        this.images.removeAll(this.images);
    }

    int reportCount = 0;
    String status = PostStatus.ACTIVE.name();
}
