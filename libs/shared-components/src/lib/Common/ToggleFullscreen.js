// FULLSCREEN
// -----------------------------------
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import $ from './wrapper.js';
import screenfull from 'screenfull';

const FSTOGGLER_EVENT = 'click.fstoggler';
const FULLSCREEN_ON_ICON = 'fa fa-expand';
const FULLSCREEN_OFF_ICON = 'fa fa-compress'

/**
 * Wrapper for screenfull plugin
 * Wraps child element and toggles
 * fullscreen mode on click
 */
export const ToggleFullscreen=(props)=>{
    const [iconClass, setIconClass] = useState(FULLSCREEN_ON_ICON);
    const element = useRef(null);

    useEffect(() => {
        const $fsToggler = $(props.element);

        // Not supported under IE
        const ua = window.navigator.userAgent;
        if (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv:11\./)) {
            $fsToggler.addClass('d-none');
            return; // and abort
        }

        $fsToggler.on(FSTOGGLER_EVENT, e => {
            e.preventDefault();

            if (screenfull.enabled) {

                screenfull.toggle();

                // Switch icon indicator
                toggleFSIcon();

            } else {
                console.log('Fullscreen not enabled');
            }
        });

        if (screenfull.raw && screenfull.raw.fullscreenchange)
            $(document).on(screenfull.raw.fullscreenchange, toggleFSIcon);

        return function cleanup() {
            $(props.element).off(FSTOGGLER_EVENT);
            $(document).off(screenfull.raw.fullscreenchange)
            }
    })

    const toggleFSIcon = () => {
        setIconClass(screenfull.isFullscreen ? FULLSCREEN_OFF_ICON : FULLSCREEN_ON_ICON)
    }

    const setRef = node => {
         element.current = node;
    }
    const {tag:Tag} = props;
    return (
        <Tag ref={setRef} {...props}>
            <em className={iconClass}></em>
        </Tag>
    )
    
}
ToggleFullscreen.propTypes = {
    /** tag to use, defaults to A */
    tag: PropTypes.string
}

ToggleFullscreen.defaultProps = {
    tag: 'a'
}

export default ToggleFullscreen;
