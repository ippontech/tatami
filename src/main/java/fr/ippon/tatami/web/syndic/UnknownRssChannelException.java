/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package fr.ippon.tatami.web.syndic;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * @author Pierre Rust
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class UnknownRssChannelException extends RuntimeException {

    public UnknownRssChannelException(String msg) {
        super(msg);
    }
}
