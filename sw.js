(function(g) {
    var window = this;
    'use strict';
    var U8 = function(d) {
        d.publish("cardstatechange", d.bb() && d.uM() ? 1 : 0)
    }
      , K9 = function(d, Q) {
        var t = g.ik(Q)
          , n = t ? Q : arguments;
        for (t = t ? 0 : 1; t < n.length; t++) {
            if (d == null)
                return;
            d = d[n[t]]
        }
        return d
    }
      , an0 = function(d) {
        var Q = g.I_(d);
        d = g.$w(d);
        return new g.yV(Q.x,Q.y,d.width,d.height)
    }
      , UzH = function(d, Q, t) {
        var n;
        return n = g.ay(d, Q, function() {
            g.UP(n);
            t.apply(d, arguments)
        }, {})
    }
      , RV = function(d) {
        d = g.HV(d);
        delete AA[d];
        g.Wz(AA) && lK && lK.stop()
    }
      , AKo = function() {
        lK || (lK = new g.B$(function() {
            K52()
        }
        ,20));
        var d = lK;
        d.isActive() || d.start()
    }
      , K52 = function() {
        var d = g.h9();
        g.OZ(AA, function(Q) {
            ln$(Q, d)
        });
        g.Wz(AA) || AKo()
    }
      , GL = function(d, Q, t, n) {
        g.i4.call(this);
        if (!Array.isArray(d) || !Array.isArray(Q))
            throw Error("Start and end parameters must be arrays");
        if (d.length != Q.length)
            throw Error("Start and end points must be the same length");
        this.N = d;
        this.U = Q;
        this.duration = t;
        this.j = n;
        this.coords = [];
        this.progress = this.G = 0;
        this.W = null
    }
      , ln$ = function(d, Q) {
        Q < d.startTime && (d.endTime = Q + d.endTime - d.startTime,
        d.startTime = Q);
        d.progress = (Q - d.startTime) / (d.endTime - d.startTime);
        d.progress > 1 && (d.progress = 1);
        d.G = 1E3 / (Q - d.W);
        d.W = Q;
        RL$(d, d.progress);
        d.progress == 1 ? (d.Z = 0,
        RV(d),
        d.onFinish(),
        d.wY()) : d.isPlaying() && d.BC()
    }
      , RL$ = function(d, Q) {
        typeof d.j === "function" && (Q = d.j(Q));
        d.coords = Array(d.N.length);
        for (let t = 0; t < d.N.length; t++)
            d.coords[t] = (d.U[t] - d.N[t]) * Q + d.N[t]
    }
      , Gbe = function(d, Q) {
        g.Xq.call(this, d);
        this.coords = Q.coords;
        this.x = Q.coords[0];
        this.y = Q.coords[1];
        this.z = Q.coords[2];
        this.duration = Q.duration;
        this.progress = Q.progress;
        this.fps = Q.G;
        this.state = Q.Z
    }
      , kW = function(d, Q, t, n, e) {
        GL.call(this, Q, t, n, e);
        this.element = d
    }
      , iK = function(d, Q, t, n, e) {
        if (Q.length != 2 || t.length != 2)
            throw Error("Start and end points must be 2D");
        kW.call(this, d, Q, t, n, e)
    }
      , kb$ = function(d) {
        return Math.pow(d, 3)
    }
      , iLH = function(d) {
        return 3 * d * d - 2 * d * d * d
    }
      , wf = function(d) {
        return d.baseUrl || null
    }
      , O8 = function(d, Q) {
        return g.Df(g.EF(d, Q), t => !!t)
    }
      , wNV = function(d, Q, t) {
        function n(WV) {
            var Mb = WV.hovercardButton;
            if (!Mb)
                return null;
            Mb = Mb.subscribeButtonRenderer;
            if (!Mb)
                return null;
            var cV = r(Mb.unsubscribedButtonText)
              , m0 = r(Mb.subscribedButtonText);
            if (Mb.subscribed) {
                var yL = r(Mb.subscriberCountWithUnsubscribeText);
                var GF = r(Mb.subscriberCountText)
            } else
                yL = r(Mb.subscriberCountText),
                GF = r(Mb.subscriberCountWithSubscribeText);
            var dg = null;
            return WV.signinEndpoint && ((dg = K9(WV, "signinEndpoint", "webNavigationEndpointData", "url")) || (dg = g.E(Mb.signInEndpoint?.commandMetadata, g.dw)?.url),
            !dg) ? null : cV && (m0 || dg) ? {
                subscribed: Mb.subscribed,
                subscribeText: cV,
                subscribeCount: yL,
                unsubscribeText: m0,
                unsubscribeCount: GF,
                enabled: Mb.enabled,
                signinUrl: dg,
                classic: WV.useClassicSubscribeButton
            } : null
        }
        function e(WV) {
            if (WV) {
                var Mb = []
                  , cV = WV.videoId;
                cV && Mb.push("v=" + cV);
                (cV = WV.playlistId) && Mb.push("list=" + cV);
                (WV = WV.startTimeSeconds) && Mb.push("t=" + WV);
                return "/watch?" + Mb.join("&")
            }
        }
        function r(WV) {
            if (!WV)
                return null;
            var Mb = WV.simpleText;
            return Mb ? Mb : WV.runs ? g.EF(WV.runs, cV => cV.text).join("") : null
        }
        Q = Q.endscreenElementRenderer;
        if (!Q)
            return null;
        var f = Q.style
          , T = Q.endpoint || {}
          , B = null
          , p = null
          , K = !1
          , A = null
          , R = null
          , G = null
          , O = null
          , P = !1
          , D = null
          , W = null
          , q = null
          , u = null
          , I = null
          , eP = null;
        if (f === "VIDEO")
            g.E(T, g.Ck) ? B = g.E(T, g.Ck).url : (eP = g.E(T, g.dn),
            B = e(eP)),
            p = !1,
            A = d,
            Q.thumbnailOverlays ? (K = Q.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer,
            R = r(K.text),
            K = K.style === "LIVE") : R = r(Q.videoDuration);
        else if (f === "PLAYLIST")
            g.E(T, g.Ck) ? B = g.E(T, g.Ck).url : (eP = g.E(T, g.dn),
            B = e(eP)),
            p = !1,
            A = d,
            G = r(Q.playlistLength);
        else if (f === "CHANNEL") {
            if (P = K9(T, "browseEndpoint", "browseId"))
                O = P,
                B = `/channel/${O}`;
            p = !1;
            A = "new";
            (P = !!Q.isSubscribe) ? D = n(Q) : W = r(Q.subscribersText)
        } else
            f === "WEBSITE" ? ((q = K9(T, "urlEndpoint", "url")) && (B = q),
            p = !0,
            A = "new",
            q = Q.icon.thumbnails[0].url) : f === "CREATOR_MERCHANDISE" && (Q.productPrice && (u = r(Q.productPrice)),
            Q.additionalFeesText && (I = r(Q.additionalFeesText)),
            (p = K9(T, "urlEndpoint", "url")) && (B = p),
            p = !0,
            A = "new");
        d = K9(Q, "title", "accessibility", "accessibilityData", "label");
        var Gv = Q.endpoint ? Q.endpoint.clickTrackingParams : null
          , mi = "";
        if (Q.metadata) {
            let WV = r(Q.metadata);
            WV && (mi = WV)
        }
        return {
            id: `element-${t}`,
            type: f,
            title: r(Q.title),
            metadata: mi,
            callToAction: r(Q.callToAction),
            U7: Q.image,
            iconUrl: q,
            left: Number(Q.left),
            width: Number(Q.width),
            top: Number(Q.top),
            aspectRatio: Number(Q.aspectRatio),
            startMs: Math.floor(Number(Q.startMs)),
            endMs: Math.floor(Number(Q.endMs)),
            videoDuration: R,
            vG: K,
            playlistLength: G,
            channelId: O,
            subscribeButton: D,
            subscribersText: W,
            isSubscribe: P,
            targetUrl: B || null,
            CP: p,
            sessionData: Gv ? {
                itct: Gv
            } : null,
            z6: A,
            sZ: d ? d : null,
            isPlaceholder: Q.isPlaceholder,
            impressionUrls: O8(Q.impressionUrls || [], wf),
            hj: O8(Q.hovercardShowUrls || [], wf),
            clickUrls: O8(T.loggingUrls || [], wf),
            visualElement: g.se(Q.trackingParams),
            productPrice: u,
            additionalFeesText: I,
            watchEndpoint: eP || null
        }
    }
      , Hw = function(d, Q) {
        var t = {
            startMs: Math.floor(Number(d.startMs)),
            impressionUrls: O8(d.impressionUrls || [], wf),
            elements: O8(d.elements || [], (n, e) => wNV(Q, n, e))
        };
        d.trackingParams && (t.visualElement = g.se(d.trackingParams));
        return t
    }
      , vw = function(d) {
        return d.player.B().playerStyle === "creator-endscreen-editor"
    }
      , OL$ = function(d) {
        return d.player.getVideoData().OA ? "current" : d.K ? "new" : "current"
    }
      , zL = function(d, Q, t=!0) {
        d.player.bV("creatorendscreen");
        d.D && (d.D.dispose(),
        d.D = null,
        d.j.dispose(),
        d.j = null);
        for (var n of Object.values(d.N))
            n.dispose();
        d.N = {};
        d.G = {};
        d.L.length > 0 && (d.L.forEach(e => {
            e.dispose()
        }
        ),
        d.L.length = 0);
        d.Z && (g.Rh(d.Z, "ytp-ce-element-show"),
        d.Z.setAttribute("aria-hidden", "true"));
        d.U = 0;
        if ((d.endscreen = Q) && Q.elements) {
            t && HLZ(d);
            t = [];
            n = new g.yK(Q.startMs,0x7ffffffffffff,{
                id: "ytp-ce-in-endscreen",
                namespace: "creatorendscreen"
            });
            t.push(n);
            d.player.B().D || (d.D = new g.dP({
                S: "div",
                O: "ytp-ce-shadow"
            }),
            g.OG(d.player, d.D.element, 4),
            d.j = new g.P5(d.D,200));
            for (n = 0; n < Q.elements.length; ++n) {
                let e = Q.elements[n]
                  , r = vp9(d, e);
                if (!r) {
                    g.C4(new g.yg("buildEndscreenElement null",e));
                    continue
                }
                d.N[e.id] = r;
                d.G[e.id] = e;
                g.OG(d.player, r.element, 4);
                let f = new g.yK(e.startMs,e.endMs,{
                    id: "ytp-ce-element-" + e.id,
                    namespace: "creatorendscreen"
                });
                t.push(f);
                zLz(d, r, e)
            }
            d.player.Va(t);
            d.hy()
        }
    }
      , mzG = function(d) {
        var Q = d.player.getVideoData()
          , t = Q.videoId;
        d.W && d.W.abort();
        t = {
            method: "POST",
            onFinish: e => {
                var r = d.W = null;
                e.status === 200 && (e = e.responseText,
                e.substring(0, 3) === ")]}" && (e = e.substring(3),
                r = JSON.parse(e),
                r = Hw(r, OL$(d))));
                zL(d, r)
            }
            ,
            urlParams: {
                v: t
            },
            withCredentials: !0
        };
        d.K && (t.urlParams.ptype = "embedded");
        var n = Q.q4;
        n && (t.postParams = {
            ad_tracking: n
        });
        if (Q = g.KAb(Q))
            if (Q = g.Ek(Q),
            Q = g.Xl(Q))
                d.W = g.a9(Q, t)
    }
      , HLZ = function(d) {
        var Q = g.N6()
          , t = g.Xz();
        t && Q && d.endscreen.visualElement && g.u8(g.eu)(void 0, t, Q, d.endscreen.visualElement)
    }
      , vp9 = function(d, Q) {
        var t = null;
        switch (Q.type) {
        case "VIDEO":
            d = {
                S: "div",
                dj: ["ytp-ce-element", "ytp-ce-video"],
                C: {
                    tabindex: "0",
                    "aria-label": Q.sZ || "",
                    "aria-hidden": "true"
                },
                A: [{
                    S: "div",
                    O: "ytp-ce-element-shadow"
                }, {
                    S: "div",
                    O: "ytp-ce-covering-image",
                    C: m6(Q)
                }, {
                    S: "div",
                    O: "ytp-ce-covering-shadow-top"
                }, {
                    S: "a",
                    O: "ytp-ce-covering-overlay",
                    C: {
                        href: hA(d, Q.targetUrl),
                        tabindex: "-1"
                    },
                    A: [{
                        S: "div",
                        dj: ["ytp-ce-video-title", "ytp-webkit-ellipsis"],
                        C: {
                            dir: g.zM(Q.title || "")
                        },
                        Wi: Q.title
                    }, {
                        S: "div",
                        O: Q.vG ? "ytp-ce-live-video-duration" : "ytp-ce-video-duration",
                        Wi: Q.videoDuration || void 0
                    }]
                }]
            };
            t = new g.dP(d);
            break;
        case "PLAYLIST":
            d = {
                S: "div",
                dj: ["ytp-ce-element", "ytp-ce-playlist"],
                C: {
                    tabindex: "0",
                    "aria-label": Q.sZ || "",
                    "aria-hidden": "true"
                },
                A: [{
                    S: "div",
                    O: "ytp-ce-element-shadow"
                }, {
                    S: "div",
                    O: "ytp-ce-covering-image",
                    C: m6(Q)
                }, {
                    S: "div",
                    O: "ytp-ce-covering-shadow-top"
                }, {
                    S: "a",
                    O: "ytp-ce-covering-overlay",
                    C: {
                        href: hA(d, Q.targetUrl),
                        tabindex: "-1"
                    },
                    A: [{
                        S: "div",
                        dj: ["ytp-ce-playlist-title", "ytp-webkit-ellipsis"],
                        C: {
                            dir: g.zM(Q.title || "")
                        },
                        Wi: Q.title
                    }, {
                        S: "div",
                        O: "ytp-ce-playlist-count",
                        A: [{
                            S: "div",
                            O: "ytp-ce-playlist-icon"
                        }, {
                            S: "div",
                            O: "ytp-ce-playlist-count-text",
                            Wi: Q.playlistLength || void 0
                        }]
                    }]
                }]
            };
            t = new g.dP(d);
            break;
        case "CHANNEL":
            t = {
                S: "div",
                dj: ["ytp-ce-element", "ytp-ce-channel", Q.isSubscribe ? "ytp-ce-channel-this" : "ytp-ce-channel-that"],
                C: {
                    tabindex: "0",
                    "aria-label": Q.sZ || "",
                    "aria-hidden": "true"
                },
                A: [{
                    S: "div",
                    O: "ytp-ce-element-shadow"
                }, {
                    S: "div",
                    O: "ytp-ce-expanding-overlay",
                    A: [{
                        S: "div",
                        O: "ytp-ce-expanding-overlay-hider"
                    }, {
                        S: "div",
                        O: "ytp-ce-expanding-overlay-background"
                    }, {
                        S: "div",
                        O: "ytp-ce-expanding-overlay-content",
                        A: [{
                            S: "div",
                            O: "ytp-ce-expanding-overlay-body",
                            A: [{
                                S: "div",
                                O: "ytp-ce-expanding-overlay-body-padding",
                                A: [{
                                    S: "a",
                                    dj: ["ytp-ce-channel-title", "ytp-ce-link"],
                                    C: {
                                        href: hA(d, Q.targetUrl),
                                        target: "_blank",
                                        tabindex: "-1",
                                        dir: g.zM(Q.title || "")
                                    },
                                    Wi: Q.title
                                }, Q.subscribeButton ? {
                                    S: "div",
                                    O: "ytp-ce-subscribe-container",
                                    A: [{
                                        S: "div",
                                        O: "ytp-ce-channel-subscribe"
                                    }]
                                } : "", Q.subscribersText ? {
                                    S: "div",
                                    O: "ytp-ce-channel-subscribers-text",
                                    C: Q.sZ ? {
                                        "aria-hidden": "true"
                                    } : {},
                                    Wi: Q.subscribersText
                                } : "", Q.metadata ? {
                                    S: "div",
                                    dj: ["ytp-ce-channel-metadata", "yt-ui-ellipsis", "yt-ui-ellipsis-3"],
                                    Wi: Q.metadata
                                } : ""]
                            }]
                        }]
                    }]
                }, {
                    S: "div",
                    O: "ytp-ce-expanding-image",
                    C: m6(Q)
                }]
            };
            t = new g.dP(t);
            let e = g.Ce(document, "div", "ytp-ce-channel-subscribe", t.element)[0];
            if (Q.subscribeButton && Q.channelId) {
                g.A0(e, "ytp-ce-subscribe-button");
                let r;
                if (d.player.B().D) {
                    var n = null;
                    r = Q.sessionData.itct
                } else
                    n = "endscreen",
                    r = null;
                n = new hLz(Q.subscribeButton.subscribeText,Q.subscribeButton.subscribeCount,Q.subscribeButton.unsubscribeText,Q.subscribeButton.unsubscribeCount,!!Q.subscribeButton.enabled,!!Q.subscribeButton.classic,Q.channelId,!!Q.subscribeButton.subscribed,n,r,d.player);
                e.appendChild(n.element);
                d.L.push(n)
            }
            break;
        case "WEBSITE":
            d = {
                S: "div",
                dj: ["ytp-ce-element", "ytp-ce-website"],
                C: {
                    tabindex: "0",
                    "aria-label": Q.sZ || "",
                    "aria-hidden": "true"
                },
                A: [{
                    S: "div",
                    O: "ytp-ce-element-shadow"
                }, {
                    S: "div",
                    O: "ytp-ce-expanding-overlay",
                    A: [{
                        S: "div",
                        O: "ytp-ce-expanding-overlay-hider"
                    }, {
                        S: "div",
                        O: "ytp-ce-expanding-overlay-background"
                    }, {
                        S: "div",
                        O: "ytp-ce-expanding-overlay-content",
                        A: [{
                            S: "div",
                            O: "ytp-ce-expanding-overlay-body",
                            A: [{
                                S: "div",
                                O: "ytp-ce-expanding-overlay-body-padding",
                                A: [{
                                    S: "div",
                                    O: "ytp-ce-website-title",
                                    C: {
                                        dir: g.zM(Q.title || "")
                                    },
                                    Wi: Q.title
                                }, {
                                    S: "div",
                                    O: "ytp-ce-website-metadata",
                                    Wi: Q.metadata
                                }, {
                                    S: "a",
                                    dj: ["ytp-ce-website-goto", "ytp-ce-link"],
                                    C: {
                                        href: hA(d, Q.targetUrl),
                                        target: "_blank",
                                        tabindex: "-1"
                                    },
                                    Wi: Q.callToAction
                                }]
                            }]
                        }]
                    }]
                }, {
                    S: "div",
                    O: "ytp-ce-expanding-image",
                    C: m6(Q)
                }, {
                    S: "div",
                    O: "ytp-ce-expanding-icon",
                    C: F5e(Q.iconUrl)
                }]
            };
            t = new g.dP(d);
            break;
        case "CREATOR_MERCHANDISE":
            t = "",
            Q.productPrice && (t = {
                S: "div",
                O: "ytp-ce-merchandise-price-container",
                A: [{
                    S: "div",
                    O: "ytp-ce-merchandise-price",
                    Wi: Q.productPrice
                }]
            },
            Q.additionalFeesText && t.A.push({
                S: "div",
                O: "ytp-ce-merchandise-additional-fees",
                Wi: Q.additionalFeesText
            })),
            d = {
                S: "div",
                dj: ["ytp-ce-element", "ytp-ce-merchandise"],
                C: {
                    tabindex: "0",
                    "aria-label": Q.sZ || "",
                    "aria-hidden": "true"
                },
                A: [{
                    S: "div",
                    O: "ytp-ce-element-shadow"
                }, {
                    S: "div",
                    O: "ytp-ce-expanding-overlay",
                    A: [{
                        S: "div",
                        O: "ytp-ce-expanding-overlay-hider"
                    }, {
                        S: "div",
                        O: "ytp-ce-expanding-overlay-background"
                    }, {
                        S: "div",
                        O: "ytp-ce-expanding-overlay-content",
                        A: [{
                            S: "div",
                            O: "ytp-ce-expanding-overlay-body",
                            A: [{
                                S: "div",
                                O: "ytp-ce-expanding-overlay-body-padding",
                                A: [{
                                    S: "div",
                                    O: "ytp-ce-merchandise-title",
                                    C: {
                                        dir: g.zM(Q.title || "")
                                    },
                                    Wi: Q.title
                                }, t, {
                                    S: "div",
                                    O: "ytp-ce-merchandise-metadata",
                                    Wi: Q.metadata
                                }, {
                                    S: "a",
                                    dj: ["ytp-ce-merchandise-goto", "ytp-ce-link"],
                                    C: {
                                        href: hA(d, Q.targetUrl),
                                        target: "_blank",
                                        tabindex: "-1"
                                    },
                                    Wi: Q.callToAction
                                }]
                            }]
                        }]
                    }]
                }, {
                    S: "div",
                    O: "ytp-ce-expanding-image",
                    C: m6(Q)
                }, {
                    S: "div",
                    O: "ytp-ce-merchandise-invideo-cta-container",
                    A: [{
                        S: "div",
                        O: "ytp-ce-merchandise-invideo-cta",
                        Wi: Q.callToAction || void 0
                    }]
                }]
            },
            t = new g.dP(d)
        }
        Q.isPlaceholder && g.A0(t.element, "ytp-ce-placeholder");
        return t
    }
      , zLz = function(d, Q, t) {
        function n() {
            f(1)
        }
        function e() {
            f(-1)
        }
        Q.listen("mouseenter", () => {
            Fy(d, Q, t)
        }
        );
        Q.listen("mouseleave", () => {
            JA(d, Q, t)
        }
        );
        d.player.B().D || Q.listen("click", () => {
            g.A0(Q.element, "ytp-ce-element-hover")
        }
        );
        Q.listen("click", T => {
            JK9(d, t, T)
        }
        );
        Q.listen("keypress", T => {
            JK9(d, t, T)
        }
        );
        Q.listen("focus", () => {
            Fy(d, Q, t)
        }
        );
        Q.listen("blur", () => {
            JA(d, Q, t)
        }
        );
        Q.listen("touchstart", () => {
            Fy(d, Q, t)
        }
        );
        var r = g.x2("ytp-ce-expanding-overlay-hider", Q.element);
        r && Q.X(r, "touchstart", T => {
            T.stopPropagation();
            g.Rh(Q.element, "ytp-ce-element-hover");
            g.Rh(Q.element, "ytp-ce-force-expand")
        }
        );
        Q.listen("keydown", T => {
            d.mq = T.keyCode === 9 && !T.shiftKey
        }
        );
        var f = T => {
            d.U += T;
            d.U > 0 ? (g.A0(Q.element, "ytp-ce-force-expand"),
            Pw(d, t.id, !0)) : (g.Rh(Q.element, "ytp-ce-force-expand"),
            g.Rh(Q.element, "ytp-ce-element-hover"),
            Pw(d, t.id, !1))
        }
        ;
        r = T => {
            T && (Q.listen("blur", () => {
                T.style.display != "none" && d.mq && T.focus()
            }
            ),
            Q.X(T, "focus", n),
            Q.X(T, "blur", e))
        }
        ;
        r(g.x2("ytp-sb-subscribe", Q.element));
        r(g.x2("ytp-sb-unsubscribe", Q.element));
        Q.listen("focus", n);
        Q.listen("blur", e)
    }
      , s8 = function(d, Q, t) {
        function n() {
            r || (e++,
            e === Q.length && (f.stop(),
            t && t()))
        }
        if (!Q || Q.length === 0 || vw(d))
            t && t();
        else {
            Q = Pi2(d, Q);
            var e = 0
              , r = !1
              , f = new g.B$( () => {
                r = !0;
                t && t()
            }
            ,1E3,d);
            f.start();
            for (d = 0; d < Q.length; d++)
                g.rz(Q[d], n)
        }
    }
      , m6 = function(d) {
        if (d.U7)
            var Q = d.U7.thumbnails;
        return F5e(Q ? Q[Q.length - 1].url : null)
    }
      , hA = function(d, Q) {
        d = d.player.B();
        if (Q) {
            if (Q.startsWith("//"))
                return d.protocol + ":" + Q;
            if (Q.startsWith("/"))
                return g.Ax(d) + Q
        } else
            return "";
        return Q
    }
      , F5e = function(d) {
        return d ? {
            style: "background-image: url(" + d + ")"
        } : {}
    }
      , Fy = function(d, Q, t) {
        g.K0(Q.element, "ytp-ce-element-hover") || (t.type === "VIDEO" || t.type === "PLAYLIST" ? g.A0(Q.element, "ytp-ce-element-hover") : d.player.B().D ? (new g.B$( () => {
            g.A0(Q.element, "ytp-ce-element-hover")
        }
        ,200)).start() : g.A0(Q.element, "ytp-ce-element-hover"),
        s8(d, t.hj),
        Pw(d, t.id, !0))
    }
      , JA = function(d, Q, t) {
        g.Rh(Q.element, "ytp-ce-element-hover");
        g.Rh(Q.element, "ytp-ce-force-expand");
        Pw(d, t.id, !1)
    }
      , JK9 = function(d, Q, t) {
        if (Q.targetUrl && (!t || t.type !== "keypress" || t.keyCode === 13)) {
            for (var n = t.target; n && !g.K0(n, "ytp-ce-element"); ) {
                g.K0(n, "subscribe-label") && gf(d, Q);
                if (g.K0(n, "ytp-ce-channel-subscribe"))
                    return;
                n = n.parentElement || null
            }
            if (!n || g.K0(n, "ytp-ce-element-hover")) {
                t.preventDefault();
                t.stopPropagation();
                if (n = d.N[Q.id])
                    JA(d, n, Q),
                    n.element.blur();
                if (t.ctrlKey || t.metaKey || Q.z6 === "new")
                    gf(d, Q),
                    d.player.sendVideoStatsEngageEvent(17, void 0),
                    d.player.pauseVideo(),
                    t = g.Ek(hA(d, Q.targetUrl)),
                    t = g.Xl(t),
                    g.lW(t, void 0, Q.sessionData);
                else {
                    let e = g.TZ(d.player.B()) || d.player.getVideoData().OA
                      , r = () => {
                        var f = hA(d, Q.targetUrl)
                          , T = Q.sessionData
                          , B = Q.watchEndpoint
                          , p = g.d3(f);
                        e && p && (p.v || p.list) ? d.player.nk(p.v, T, p.list, !1, void 0, B || void 0) : g.A_(f, T)
                    }
                    ;
                    gf(d, Q, () => {
                        d.player.sendVideoStatsEngageEvent(17, r)
                    }
                    )
                }
            }
        }
    }
      , Pw = function(d, Q, t) {
        d.D && (t ? d.j.show() : d.j.hide());
        for (let n of Object.keys(d.N))
            n !== Q && g.kl(d.N[n].element, "ytp-ce-element-shadow-show", t)
    }
      , gf = function(d, Q, t) {
        s8(d, Q.clickUrls, t);
        (d = g.Xz()) && Q.CP && g.Kk(d, Q.visualElement)
    }
      , Pi2 = function(d, Q) {
        var t = d.player.getVideoData().clientPlaybackNonce;
        d = d.player.getCurrentTime().toFixed(2);
        t = {
            CPN: t,
            AD_CPN: t,
            MT: d
        };
        d = [];
        for (let n = 0; n < Q.length; n++)
            d.push(sde(Q[n], t));
        return d
    }
      , sde = function(d, Q) {
        return d.replace(/%5B[a-zA-Z_:]+%5D|\[[a-zA-Z_:]+\]/g, t => {
            var n = unescape(t);
            n = n.substring(1, n.length - 1);
            return Q[n] ? escape(Q[n]) : t
        }
        )
    }
      , gpZ = function(d) {
        return typeof d === "string" ? d : ""
    }
      , yk = function(d, Q, t) {
        for (let n in Q)
            if (Q[n] === d)
                return d;
        return t
    }
      , Nm = function(d) {
        if (!d)
            return null;
        var Q = g.Ek(gpZ(d.value));
        Q = g.Xl(Q);
        if (!Q)
            return null;
        var t = yk(d.target, yK6, "current");
        if (t == null)
            d = null;
        else {
            var n = d.show_link_icon;
            d = new NT$(Q,t,n === "true" || n === "false" ? n === "true" : !0,d.pause_on_navigation != null ? d.pause_on_navigation : !0)
        }
        return d
    }
      , W52 = function(d) {
        if (!d)
            return null;
        var Q = yk(d.type, XNe)
          , t = yk(d.trigger, YH0);
        d = d.url;
        d = Array.isArray(d) && d.length ? d[0] : d;
        d = Nm(d ? d : null);
        return Q ? new Dz2(Q,t,d) : null
    }
      , Eph = function(d, Q) {
        return g.L7(d.action, Q)
    }
      , Xy = function(d, Q) {
        d = "background-image: url(" + d + ");";
        var t = [];
        Q && t.push(Q);
        return {
            S: "div",
            O: "iv-card-image",
            C: {
                style: d
            },
            A: t
        }
    }
      , DA = function(d) {
        return d.customMessage ? YW("div", "iv-card-message", d.customMessage) : ""
    }
      , Ww = function(d) {
        if (!d.metaInfo || d.metaInfo.length === 0)
            return "";
        var Q = [];
        for (let t of d.metaInfo)
            Q.push(YW("li", "", t));
        return {
            S: "ul",
            O: "iv-card-meta-info",
            A: Q
        }
    }
      , E8 = function(d, Q, t, n) {
        if (n)
            for (let e of Q)
                d.Z(e, n, t.id, t.sessionData, t.EK.click, 5)
    }
      , YW = function(d, Q, t) {
        Q ? typeof Q === "string" ? Q = {
            "class": Q
        } : Array.isArray(Q) && (Q = {
            "class": Q.join(" ")
        }) : Q = {};
        Q.dir = g.zM(t);
        return {
            S: d,
            C: Q,
            Wi: t
        }
    }
      , ue6 = function(d) {
        if (!d.customMessage)
            return "";
        var Q = ["iv-card-action", "iv-card-primary-link"]
          , t = {};
        d.fT && (Q.push("iv-card-action-icon"),
        t.style = "background-image: url(" + d.fT + ");");
        t.dir = g.zM(d.customMessage);
        var n = [{
            S: "span",
            Wi: d.customMessage
        }];
        d.showLinkIcon && (n.push("\u00a0"),
        n.push({
            S: "span",
            O: "iv-card-link-icon"
        }));
        return {
            S: "div",
            dj: Q,
            C: t,
            A: n
        }
    }
      , qH2 = function(d) {
        var Q;
        (Q = d) && !(Q = d.length > 1 ? d.charAt(0) === "/" && d.charAt(1) !== "/" : d === "/") && (Q = d.replace(/^(https?:)?\/\//, "").split("/", 1),
        Q = !Q || Q.length < 1 || !Q[0] ? [] : Q[0].toLowerCase().split(".").reverse(),
        Q = Q[0] === "com" && Q[1] === "youtube" || Q[0] === "be" && Q[1] === "youtu");
        return Q ? d.indexOf("/redirect?") === -1 : !1
    }
      , bLh = function(d, Q) {
        return Q ? Q : qH2(d) ? "current" : "new"
    }
      , uK = function(d, Q, t, n, e, r, f) {
        d.context.Z.listen(Q, "click", T => {
            d.rj(t, n, e, r || [], f || 0, T)
        }
        );
        d.context.Z.listen(Q, "touchstart", () => {
            d.Jh = !1
        }
        );
        d.context.Z.listen(Q, "touchmove", () => {
            d.Jh = !0
        }
        )
    }
      , SH0 = function(d) {
        if (g.E(d, g.Ck)?.url)
            return g.E(d, g.Ck).url;
        if ((d = g.E(d, g.dn)) && d.videoId) {
            let Q = "/watch?v=" + d.videoId;
            d.playlistId && (Q += "&list=" + d.playlistId);
            d.index && (Q += "&index=" + d.index);
            d.startTimeSeconds && (Q += "&t=" + d.startTimeSeconds);
            return Q
        }
        return null
    }
      , qm = function(d, Q, t) {
        return {
            rD: (d.impressionLoggingUrlsV2s || []).map(n => n.baseUrl || ""),
            click: (t.loggingUrls || []).map(n => n.baseUrl || ""),
            close: (Q.dismissLoggingUrlsV2s || []).map(n => n.baseUrl || ""),
            s9: (Q.impressionLoggingUrlsV2s || []).map(n => n.baseUrl || ""),
            PS: (Q.clickLoggingUrlsV2s || []).map(n => n.baseUrl || "")
        }
    }
      , Vk = function(d, Q) {
        if (Q.onClickCommand && g.E(Q.onClickCommand, g.No6)?.targetId === "engagement-panel-error-corrections") {
            d.Qd = Q;
            var t = !0
        } else
            t = !1;
        if (!t || MTH(d, Q))
            if (t = VT6(d, Q)) {
                var n = {
                    Z5: Q,
                    X8: t.element,
                    Of: !1
                };
                if (Q.onClickCommand)
                    d.IC || In6(d),
                    bK(d, Q.id),
                    t = d.findLastIndex(n),
                    g.a6(d.cards, t, 0, n);
                else {
                    d.isInitialized || L5h(d);
                    bK(d, Q.id);
                    let e = d.findLastIndex(n);
                    g.a6(d.cards, e, 0, n);
                    t.wj(d.N, e);
                    d.qZ()
                }
                Q.autoOpen ? d.addCueRange(Q.startMs, 0x8000000000000, Q.id, () => {
                    d.D || (d.Z = n,
                    SG(d),
                    CiG(d, n),
                    Mm(d, "YOUTUBE_DRAWER_AUTO_OPEN", !1))
                }
                ) : (t = d.context.Y.getCurrentTime() * 1E3,
                t < 5E3 && t > Q.startMs && xzo(d, n),
                d.addCueRange(Q.startMs, Q.startMs + 1, Q.id, () => {
                    xzo(d, n)
                }
                ),
                SG(d))
            }
    }
      , IV = function(d) {
        d.D && (d.xl.hide(),
        d.Xf.N(),
        g.Rh(d.context.Y.getRootNode(), g.We.IV_DRAWER_OPEN),
        d.D = !1,
        U8(d.Y),
        d.j && d.j.stop(),
        d.j = new g.B$( () => {
            d.Oh && (d.Oh.focus(),
            d.Oh = null)
        }
        ,330),
        d.j.start())
    }
      , cKh = function(d, Q) {
        Q = Q.data;
        Q.autoOpenMs && d.addCueRange(Q.autoOpenMs, 0x8000000000000, "", () => {
            Mm(d, "YOUTUBE_DRAWER_AUTO_OPEN")
        }
        );
        Q.autoCloseMs && d.addCueRange(Q.autoCloseMs, 0x8000000000000, "", () => {
            IV(d)
        }
        );
        var t = Q.headerText;
        g.Ah(d.Sm, t);
        d.L && d.L.setAttribute("data-tooltip-title", t);
        Q.eventId && (d.eventId = Q.eventId);
        d.Vd = g.se(Q.trackingParams);
        d.U = g.se(Q.closeTrackingParams);
        d.Xn = g.se(Q.iconTrackingParams)
    }
      , L9 = function(d, Q, t) {
        var n = -1
          , e = -1;
        for (let r = 0; r < d.length; r++) {
            if (d[r].height === Q || d[r].width === t)
                return d[r];
            ((d[r].height || 0) < Q || (d[r].width || 0) < t) && (n < 0 || (d[n].height || 0) < (d[r].height || 0) || (d[n].width || 0) < (d[r].width || 0)) ? n = r : ((d[r].height || 0) >= Q || (d[r].width || 0) >= t) && (e < 0 || (d[e].height || 0) > (d[r].height || 0) || (d[e].width || 0) > (d[r].width || 0)) && (e = r)
        }
        return d[e >= 0 ? e : n]
    }
      , C9 = function(d, Q, t, n) {
        return {
            feature: t.feature ? t.feature : "cards",
            src_vid: d.context.videoData.videoId,
            annotation_id: Q,
            ei: d.context.videoData.eventId || "",
            itct: n.trackingParams || ""
        }
    }
      , doG = function(d, Q) {
        var t = Q.cardId ? Q.cardId : `cr:${d.G}`
          , n = d.Y.B().experiments.aM("enable_error_corrections_infocard_web_client");
        if (!Q.content && Q.teaser.simpleCardTeaserRenderer && n) {
            n = Q.teaser.simpleCardTeaserRenderer;
            var e = Q.icon ? Q.icon.infoCardIconRenderer : null;
            if (n.channelAvatar && n.channelAvatar.thumbnails && n.channelAvatar.thumbnails.length > 0)
                var r = L9(n.channelAvatar.thumbnails, 22, 22).url;
            Q = {
                id: t,
                timestamp: d.G,
                type: "simple",
                teaserText: g.Ov(n.message),
                teaserDurationMs: Number(Q.cueRanges[0].teaserDurationMs),
                startMs: Number(Q.cueRanges[0].startCardActiveMs),
                autoOpen: !!Q.autoOpen,
                sessionData: {},
                sponsored: !1,
                EK: {},
                e_: null,
                oR: n.trackingParams ? g.se(n.trackingParams) : null,
                Xn: e && e.trackingParams ? g.se(e.trackingParams) : null,
                imageUrl: "",
                displayDomain: null,
                showLinkIcon: !1,
                fT: null,
                title: "",
                customMessage: "",
                url: null,
                onClickCommand: n.onTapCommand || null,
                DA: r
            };
            Vk(d, Q)
        } else if (Q.content?.simpleCardContentRenderer) {
            if (!Q.cueRanges.length)
                return;
            r = Q.content?.simpleCardContentRenderer;
            n = Q.teaser.simpleCardTeaserRenderer;
            e = Q.icon ? Q.icon.infoCardIconRenderer : null;
            Q = {
                id: t,
                timestamp: d.G,
                type: "simple",
                teaserText: g.Ov(n.message),
                teaserDurationMs: Number(Q.cueRanges[0].teaserDurationMs),
                startMs: Number(Q.cueRanges[0].startCardActiveMs),
                autoOpen: !!Q.autoOpen,
                sessionData: C9(d, t, Q, r),
                sponsored: !1,
                EK: qm(r, n, r.command),
                e_: r.trackingParams ? g.se(r.trackingParams) : null,
                oR: n.trackingParams ? g.se(n.trackingParams) : null,
                Xn: e && e.trackingParams ? g.se(e.trackingParams) : null,
                imageUrl: L9(r.image.thumbnails, 290, 290).url,
                displayDomain: r.displayDomain ? g.Ov(r.displayDomain) : null,
                showLinkIcon: !!r.showLinkIcon,
                fT: null,
                title: r.title ? g.Ov(r.title) : "",
                customMessage: r.callToAction ? g.Ov(r.callToAction) : "",
                url: g.E(r.command, g.Ck).url ? Nm({
                    pause_on_navigation: !d.context.videoData.isLivePlayback,
                    target: "new",
                    value: g.E(r.command, g.Ck).url
                }) : null,
                onClickCommand: null
            };
            Vk(d, Q)
        } else if (Q.content?.collaboratorInfoCardContentRenderer) {
            if (!Q.cueRanges.length)
                return;
            r = Q.content?.collaboratorInfoCardContentRenderer;
            n = Q.teaser.simpleCardTeaserRenderer;
            e = Q.icon ? Q.icon.infoCardIconRenderer : null;
            Q = {
                id: t,
                timestamp: d.G,
                type: "collaborator",
                teaserText: g.Ov(n.message),
                teaserDurationMs: Number(Q.cueRanges[0].teaserDurationMs),
                startMs: Number(Q.cueRanges[0].startCardActiveMs),
                autoOpen: !!Q.autoOpen,
                sessionData: C9(d, t, Q, r),
                sponsored: !1,
                EK: qm(r, n, r.endpoint),
                e_: r.trackingParams ? g.se(r.trackingParams) : null,
                oR: n.trackingParams ? g.se(n.trackingParams) : null,
                Xn: e && e.trackingParams ? g.se(e.trackingParams) : null,
                channelId: g.E(r.endpoint, g.j_).browseId,
                customMessage: r.customText ? g.Ov(r.customText) : null,
                profileImageUrl: L9(r.channelAvatar.thumbnails, 290, 290).url,
                title: r.channelName ? g.Ov(r.channelName) : "",
                metaInfo: [r.subscriberCountText ? g.Ov(r.subscriberCountText) : ""],
                url: Nm({
                    pause_on_navigation: !d.context.videoData.isLivePlayback,
                    target: "new",
                    value: g.E(r.endpoint, g.j_).canonicalBaseUrl ? g.E(r.endpoint, g.j_).canonicalBaseUrl : `/channel/${g.E(r.endpoint, g.j_).browseId}`
                }),
                onClickCommand: null
            };
            Vk(d, Q)
        } else if (Q.content?.playlistInfoCardContentRenderer) {
            if (!Q.cueRanges.length)
                return;
            r = Q.content?.playlistInfoCardContentRenderer;
            n = Q.teaser.simpleCardTeaserRenderer;
            e = Q.icon ? Q.icon.infoCardIconRenderer : null;
            Q = {
                id: t,
                timestamp: d.G,
                type: "playlist",
                teaserText: g.Ov(n.message),
                teaserDurationMs: Number(Q.cueRanges[0].teaserDurationMs),
                startMs: Number(Q.cueRanges[0].startCardActiveMs),
                autoOpen: !!Q.autoOpen,
                sessionData: C9(d, t, Q, r),
                sponsored: !1,
                EK: qm(r, n, r.action),
                e_: r.trackingParams ? g.se(r.trackingParams) : null,
                oR: n.trackingParams ? g.se(n.trackingParams) : null,
                Xn: e && e.trackingParams ? g.se(e.trackingParams) : null,
                WQ: L9(r.playlistThumbnail.thumbnails, 258, 290).url,
                customMessage: r.customMessage ? g.Ov(r.customMessage) : null,
                playlistVideoCount: g.Ov(r.playlistVideoCount),
                title: r.playlistTitle ? g.Ov(r.playlistTitle) : "",
                metaInfo: [r.channelName ? g.Ov(r.channelName) : "", r.videoCountText ? g.Ov(r.videoCountText) : ""],
                url: Nm({
                    pause_on_navigation: !d.context.videoData.isLivePlayback,
                    target: "new",
                    value: SH0(r.action)
                }),
                onClickCommand: null
            };
            Vk(d, Q)
        } else if (Q.content?.videoInfoCardContentRenderer) {
            if (!Q.cueRanges.length)
                return;
            r = Q.content?.videoInfoCardContentRenderer;
            n = Q.teaser.simpleCardTeaserRenderer;
            e = Q.icon ? Q.icon.infoCardIconRenderer : null;
            Q = {
                id: t,
                timestamp: d.G,
                type: "video",
                teaserText: g.Ov(n.message),
                teaserDurationMs: Number(Q.cueRanges[0].teaserDurationMs),
                startMs: Number(Q.cueRanges[0].startCardActiveMs),
                autoOpen: !!Q.autoOpen,
                sessionData: C9(d, t, Q, r),
                sponsored: !1,
                EK: qm(r, n, r.action),
                e_: r.trackingParams ? g.se(r.trackingParams) : null,
                oR: n.trackingParams ? g.se(n.trackingParams) : null,
                Xn: e && e.trackingParams ? g.se(e.trackingParams) : null,
                WQ: L9(r.videoThumbnail.thumbnails, 258, 290).url,
                videoDuration: r.lengthString ? g.Ov(r.lengthString) : null,
                customMessage: r.customMessage ? g.Ov(r.customMessage) : null,
                title: r.videoTitle ? g.Ov(r.videoTitle) : "",
                metaInfo: [r.channelName ? g.Ov(r.channelName) : "", r.viewCountText ? g.Ov(r.viewCountText) : ""],
                isLiveNow: !!r.badge,
                url: Nm({
                    pause_on_navigation: !d.context.videoData.isLivePlayback,
                    target: "new",
                    value: SH0(r.action)
                }),
                onClickCommand: null
            };
            Vk(d, Q)
        }
        d.G++
    }
      , $o$ = function(d, Q) {
        return g.L7(d.cards, t => t.Z5.id === Q)
    }
      , SG = function(d) {
        g.kl(d.Y.getRootNode(), "ytp-cards-shopping-active", QhZ(d))
    }
      , bK = function(d, Q) {
        if (Q = $o$(d, Q))
            Q === d.Z && (d.Z = null),
            d.Y.removeCueRange(Q.Z5.id),
            g.UL(Q.X8),
            g.f$(d.cards, Q),
            d.qZ(),
            SG(d)
    }
      , Mm = function(d, Q, t) {
        if (!d.D) {
            d.xl.show();
            d.TM = new g.B$( () => {
                g.A0(d.context.Y.getRootNode(), g.We.IV_DRAWER_OPEN)
            }
            ,0);
            d.TM.start();
            d.Xf.X(d.N, "mousewheel", e => {
                d.jH.start();
                e.preventDefault();
                e = e || window.event;
                var r = 0;
                e.type == "MozMousePixelScroll" ? r = 0 == (e.axis == e.HORIZONTAL_AXIS) ? e.detail : 0 : window.opera ? r = e.detail : r = e.wheelDelta % 120 == 0 ? "WebkitTransform" in document.documentElement.style ? window.chrome && navigator.platform.indexOf("Mac") == 0 ? e.wheelDeltaY / -30 : e.wheelDeltaY / -1.2 : e.wheelDelta / -1.6 : e.wheelDeltaY / -3;
                if (e = r)
                    d.N.scrollTop += e
            }
            );
            d.D = !0;
            var n = g.Xz();
            n && d.Vd && d.U && g.ag(n, [d.Vd, d.U]);
            Q = {
                TRIGGER_TYPE: Q
            };
            for (let e of d.cards)
                e.Of || (e.Of = !0,
                tr6(d.context.logger, e.Z5.EK.rD, Q)),
                n && g.ag(n, [e.Z5.e_]);
            U8(d.Y);
            t && (d.j = new g.B$( () => {
                d.Oh = d.L;
                d.y$.focus()
            }
            ,330),
            d.j.start())
        }
    }
      , L5h = function(d) {
        g.l4(d.GL(), [g.We.STOP_EVENT_PROPAGATION, "iv-drawer-manager"]);
        g.OG(d.Y, d.W, 5);
        d.Zw();
        d.L = g.x2("ytp-cards-button", d.Y.getRootNode());
        d.y$ = g.x2("iv-drawer-close-button", d.W);
        d.isInitialized = !0
    }
      , In6 = function(d) {
        d.mq.push(g.GX("iv-teaser-shown", d.iB, d));
        d.mq.push(g.GX("iv-teaser-hidden", d.m4, d));
        d.mq.push(g.GX("iv-teaser-clicked", d.dW, d));
        d.IC = !0
    }
      , MTH = function(d, Q) {
        d.Qd = Q;
        var t = d.Y.getVideoData();
        if (!t)
            return !1;
        t = g.Ns(t.getWatchNextResponse());
        if (t?.markersMap)
            for (let e = 0; t?.markersMap.length > e; e++) {
                var n = t?.markersMap[e];
                if (n.key === "ERROR_CORRECTION_MARKERS" && (n = n.value?.markers) && n.length > 0)
                    return Q.startMs = g.E(n[0], g.ezF)?.timeRangeStartMillis || 0,
                    d.Qd = null,
                    !0
            }
        return !1
    }
      , VT6 = function(d, Q) {
        switch (Q.type) {
        case "simple":
            d = d.NZ;
            var t = Q.displayDomain ? {
                S: "div",
                O: "iv-card-image-text",
                Wi: Q.displayDomain
            } : void 0;
            var n = ue6(Q);
            t = {
                S: "div",
                dj: ["iv-card"],
                A: [{
                    S: "a",
                    O: "iv-click-target",
                    C: {
                        href: Q.url ? Q.url.Z() || "" : ""
                    },
                    A: [Xy(Q.imageUrl, t), {
                        S: "div",
                        O: "iv-card-content",
                        A: [YW("h2", void 0, Q.title), n]
                    }]
                }]
            };
            t = new g.dP(t);
            E8(d, g.Le("iv-click-target", t.element), Q, Q.url);
            Q = t;
            break;
        case "collaborator":
            d = d.NZ;
            t = {
                S: "div",
                dj: ["iv-card", "iv-card-channel"],
                A: [{
                    S: "a",
                    dj: ["iv-click-target"],
                    C: {
                        href: Q.url.Z() || "",
                        "data-ytid": Q.channelId
                    },
                    A: [Xy(Q.profileImageUrl), {
                        S: "div",
                        O: "iv-card-content",
                        A: [DA(Q), {
                            S: "h2",
                            O: "iv-card-primary-link",
                            Wi: Q.title
                        }, Ww(Q)]
                    }]
                }]
            };
            t = new g.dP(t);
            E8(d, g.Le("iv-click-target", t.element), Q, Q.url);
            Q = t;
            break;
        case "playlist":
            d = d.NZ;
            t = {
                S: "div",
                dj: ["iv-card", "iv-card-playlist"],
                A: [{
                    S: "a",
                    O: "iv-click-target",
                    C: {
                        href: Q.url.Z() || ""
                    },
                    A: [Xy(Q.WQ, {
                        S: "div",
                        O: "iv-card-image-overlay",
                        A: [{
                            S: "span",
                            O: "iv-card-playlist-video-count",
                            Wi: Q.playlistVideoCount
                        }]
                    }), {
                        S: "div",
                        O: "iv-card-content",
                        A: [DA(Q), YW("h2", "iv-card-primary-link", Q.title), Ww(Q)]
                    }]
                }]
            };
            t = new g.dP(t);
            E8(d, g.Le("iv-click-target", t.element), Q, Q.url);
            Q = t;
            break;
        case "productListing":
            d = d.NZ;
            var e = Q.offers.length != 0;
            t = ["iv-card"];
            n = "";
            var r = ue6(Q);
            e && (t.push("iv-card-product-listing"),
            n = "iv-card-primary-link",
            r = Q.offers[0],
            e = [],
            r.price && e.push({
                S: "div",
                O: "iv-card-offer-price",
                Wi: r.price
            }),
            r.merchant && e.push({
                S: "div",
                O: "iv-card-offer-merchant",
                Wi: r.merchant
            }),
            r = {
                S: "div",
                A: e
            });
            e = Q.url ? Q.url.Z() || "" : "";
            t = {
                S: "div",
                dj: t,
                C: {
                    tabindex: "0"
                },
                A: [{
                    S: "a",
                    dj: ["iv-card-image", "iv-click-target"],
                    C: {
                        style: "background-image: url(" + Q.imageUrl + ");",
                        href: e,
                        "aria-hidden": "true",
                        tabindex: "-1"
                    }
                }, {
                    S: "div",
                    O: "iv-card-content",
                    A: [Q.sponsored ? {
                        S: "div",
                        O: "iv-card-sponsored",
                        A: ["Sponsored", {
                            S: "div",
                            O: "iv-ad-info-container",
                            A: [{
                                S: "div",
                                O: "iv-ad-info",
                                Wi: "{{adInfo}}"
                            }, {
                                S: "div",
                                O: "iv-ad-info-icon-container",
                                A: [{
                                    S: "div",
                                    O: "iv-ad-info-icon"
                                }, {
                                    S: "div",
                                    O: "iv-ad-info-callout"
                                }]
                            }]
                        }]
                    } : "", {
                        S: "a",
                        O: "iv-click-target",
                        C: {
                            href: e
                        },
                        A: [YW("h2", n, Q.title), r]
                    }]
                }]
            };
            t = new g.dP(t);
            n = g.BP("span");
            g.Ah(n, "You are seeing this product because we think it is relevant to the video. Google may be compensated by the merchant.");
            t.setContent(n, "adInfo");
            E8(d, g.Le("iv-click-target", t.element), Q, Q.url);
            Q = t;
            break;
        case "video":
            d = d.NZ;
            t = Q.isLiveNow ? {
                S: "span",
                dj: ["yt-badge", "yt-badge-live"],
                Wi: "LIVE NOW"
            } : null;
            t = {
                S: "div",
                dj: ["iv-card", "iv-card-video"],
                A: [{
                    S: "a",
                    O: "iv-click-target",
                    C: {
                        href: Q.url?.Z() || ""
                    },
                    A: [Xy(Q.WQ, Q.videoDuration ? {
                        S: "span",
                        O: "iv-card-video-duration",
                        Wi: Q.videoDuration
                    } : void 0), {
                        S: "div",
                        O: "iv-card-content",
                        A: [DA(Q), YW("h2", "iv-card-primary-link", Q.title), Ww(Q), t]
                    }]
                }]
            };
            t = new g.dP(t);
            E8(d, g.Le("iv-click-target", t.element), Q, Q.url);
            Q = t;
            break;
        default:
            return null
        }
        return Q
    }
      , xzo = function(d, Q) {
        if (!g.K0(d.Y.getRootNode(), "ytp-cards-teaser-shown")) {
            if (d.Z !== Q) {
                var t = g.Xz()
                  , n = d.Z ? d.Z.Z5.Xn : d.Xn;
                t && n && g.Uv(t, [n]);
                d.Z = Q;
                SG(d)
            }
            (t = d.isInitialized && d.GL().style.display == "none") || (t = d.context.Y.getPlayerState(),
            n = t === 0 && d.context.Y.getCurrentTime() === 0,
            t = !(t === 1 || t === 3 || n));
            t || Q.Z5.teaserDurationMs && d.Y.qY(!0, {
                teaserText: Q.Z5.teaserText,
                durationMs: Q.Z5.teaserDurationMs,
                onClickCommand: Q.Z5.onClickCommand,
                DA: Q.Z5.DA ?? null
            });
            d.KI.isActive() || ((!d.D || !d.jH.isActive() && d.LI) && CiG(d, Q),
            d.KI.start(910 + Q.Z5.teaserDurationMs))
        }
    }
      , QhZ = function(d) {
        return d.Z ? d.Z.Z5.type === "productListing" : d.Y.V("enable_wn_infocards") ? !!d.cards?.length && g.VL(d.cards, Q => Q.Z5.type === "productListing") : g.VL(d.cards, Q => Q.Z5.type === "productListing")
    }
      , CiG = function(d, Q) {
        d.K.Bz ? (Q = new GL([0, d.N.scrollTop],[0, Q.X8.offsetTop],600,iLH),
        d.context.D.listen(Q, "animate", t => {
            d.N.scrollTop = t.y
        }
        ),
        d.context.D.listen(Q, "finish", t => {
            d.N.scrollTop = t.y
        }
        ),
        Q.play()) : (d.K.Qq(!0),
        d.N.scrollTop = Q.X8.offsetTop,
        d.K.Qq(!1))
    }
      , xW = function(d) {
        return d.Z && d.Z.Z5 ? d.Z.Z5 : d.cards[0] && d.cards[0].Z5 ? d.cards[0].Z5 : null
    }
      , nl2 = function(d) {
        var Q = d.annotation.data;
        "start_ms" in Q && "end_ms" in Q && d.addCueRange(Number(Q.start_ms), Number(Q.end_ms), d.annotation.id, () => {
            d.show()
        }
        , () => {
            d.hide()
        }
        )
    }
      , eI$ = function(d, Q) {
        var t = an0(Q).width;
        g.M$(Q, t);
        t = new iK(Q,[t, Q.offsetTop],[t - t, Q.offsetTop],200,kb$);
        g.X(d, t);
        d.context.D.listen(t, "begin", () => {
            g.Qf(Q, !0)
        }
        );
        t.play()
    }
      , cw = function(d, Q, t) {
        t.stopPropagation();
        r0V(d);
        f6O(d, Q);
        d.Z.focus()
    }
      , T8O = function(d) {
        var Q = d.annotation.data;
        if (d.annotation.style === "cta")
            var t = 6;
        else if (d.annotation.style === "video" || d.annotation.style === "playlist")
            t = 7;
        d.G = Q.collapsedelay_ms || d.G;
        var n = ["iv-promo", "iv-promo-inactive"];
        d.GL().setAttribute("aria-hidden", "true");
        d.GL().setAttribute("aria-label", "Promotion");
        d.GL().tabIndex = 0;
        var e = d.annotation.HV()
          , r = Q.image_url;
        if (r) {
            var f = d.createElement({
                S: "div",
                dj: ["iv-promo-img", "iv-click-target"]
            });
            r = d.createElement({
                S: "img",
                C: {
                    src: r,
                    "aria-hidden": "true"
                }
            });
            f.appendChild(r);
            Q.video_duration && !Q.is_live ? (r = d.createElement({
                S: "span",
                O: "iv-promo-video-duration",
                Wi: Q.video_duration
            }),
            f.appendChild(r)) : Q.playlist_length && (r = d.createElement({
                S: "span",
                O: "iv-promo-playlist-length",
                Wi: Q.playlist_length.toString()
            }),
            f.appendChild(r));
            e && uK(d, f, e, d.annotation.id, Q.session_data, void 0, t)
        }
        e ? (r = d.createElement({
            S: "a",
            O: "iv-promo-txt"
        }),
        g.b5(r, e.Z()),
        d.Z = r) : d.Z = d.createElement({
            S: "div",
            O: "iv-promo-txt"
        });
        switch (d.annotation.style) {
        case "cta":
        case "website":
            var T = d.createElement({
                S: "p",
                A: [{
                    S: "strong",
                    Wi: Q.text_line_1
                }]
            });
            var B = d.createElement({
                S: "p",
                A: [{
                    S: "span",
                    O: "iv-promo-link",
                    Wi: Q.text_line_2
                }]
            });
            if (r = Q.text_line_3) {
                n.push("iv-promo-website-card-cta-redesign");
                var p = d.createElement({
                    S: "button",
                    dj: ["iv-promo-round-expand-icon", "ytp-button"]
                });
                r = d.createElement({
                    S: "button",
                    dj: ["iv-button", "iv-promo-button"],
                    A: [{
                        S: "span",
                        O: "iv-button-content",
                        Wi: r
                    }]
                });
                var K = d.createElement({
                    S: "div",
                    O: "iv-promo-button-container"
                });
                K.appendChild(r);
                e && uK(d, d.GL(), e, d.annotation.id, Q.session_data, void 0, t)
            }
            g.A0(d.Z, "iv-click-target");
            e && uK(d, d.Z, e, d.annotation.id, Q.session_data, void 0, t);
            break;
        case "playlist":
        case "video":
            T = d.createElement({
                S: "p",
                A: [{
                    S: "span",
                    Wi: Q.text_line_1
                }]
            }),
            B = d.createElement({
                S: "p",
                A: [{
                    S: "strong",
                    Wi: Q.text_line_2
                }]
            }),
            Q.is_live && (T = B,
            B = d.createElement({
                S: "span",
                dj: ["yt-badge", "iv-promo-badge-live"],
                Wi: "LIVE NOW"
            })),
            g.A0(d.Z, "iv-click-target"),
            e && uK(d, d.Z, e, d.annotation.id, Q.session_data, void 0, t),
            n.push("iv-promo-video")
        }
        T && d.Z.appendChild(T);
        B && d.Z.appendChild(B);
        d.U.appendChild(d.Z);
        K && d.U.appendChild(K);
        t = d.createElement({
            S: "div",
            O: "iv-promo-actions"
        });
        d.N = d.createElement({
            S: "button",
            dj: ["iv-promo-expand", "ytp-button"]
        });
        d.N.title = "Expand";
        d.context.Z.listen(d.N, "click", A => {
            cw(d, 5E3, A)
        }
        );
        t.appendChild(d.N);
        g.Qf(d.N, !1);
        d.context.Z.listen(d.GL(), "mouseover", d.jH, d);
        d.context.Z.listen(d.GL(), "mouseout", d.NZ, d);
        d.context.Z.listen(d.GL(), "touchend", A => {
            cw(d, 5E3, A)
        }
        );
        d.D = d.createElement({
            S: "button",
            dj: ["iv-promo-close", "ytp-button"]
        });
        d.D.title = "Close";
        d.context.Z.listen(d.D, "click", d.annotation.style === "cta" && Q.text_line_3 ? d.Qd : d.mq, d);
        t.appendChild(d.D);
        g.l4(d.GL(), n);
        f && (g.pT(d.GL(), f),
        p && f.appendChild(p));
        g.pT(d.GL(), d.U);
        g.pT(d.GL(), t)
    }
      , dA = function(d) {
        d.W && (g.oX.clearTimeout(d.W),
        d.W = null)
    }
      , r0V = function(d) {
        d.j.stop();
        d.isCollapsed && (g.GM(d.GL(), ["iv-promo-collapsed", "iv-promo-collapsed-no-delay"]),
        d.isCollapsed = !1,
        d.Z && d.Z.removeAttribute("aria-hidden"),
        g.Qf(d.N, !1),
        g.Qf(d.D, !0))
    }
      , f6O = function(d, Q) {
        d.W || (d.W = g.Kn(function() {
            dA(this);
            jhh(this)
        }, Q, d))
    }
      , jhh = function(d) {
        d.isCollapsed || d.L || d.W || (g.A0(d.GL(), "iv-promo-collapsed"),
        d.isCollapsed = !0,
        d.j.start())
    }
      , tr6 = function(d, Q, t) {
        Q && (t ? $5(d, Q.map(n => g.d8(n, t))) : $5(d, Q))
    }
      , $5 = function(d, Q, t, n) {
        var e = 1
          , r = void 0
          , f = -1;
        if (t) {
            let T = !1;
            r = () => {
                e--;
                e || T || (clearTimeout(f),
                T = !0,
                t())
            }
            ;
            f = setTimeout( () => {
                T = !0;
                t()
            }
            , 1E3)
        }
        for (let T of Q || [])
            e++,
            g.rz(T, r);
        n && (e++,
        n !== 0 && d.Y.sendVideoStatsEngageEvent(n, r))
    }
      , B80 = function(d) {
        return d === "annotation-editor" || d === "live-dashboard"
    }
      , Z0Z = function(d) {
        d.W && (d.player.removeEventListener("videodatachange", d.W),
        d.W = null)
    }
      , p$2 = function(d) {
        d = d.createElement({
            S: "div",
            dj: ["annotation", "annotation-type-custom"]
        });
        g.Qf(d, !1);
        return d
    }
      , tq = function(d, Q) {
        var t = !1
          , n = Q.getElementsByTagName("annotations");
        if (n && !(n.length < 1) && (n = n[0].getAttribute("itct"))) {
            var e = g.Xz();
            if (e) {
                var r = g.N6();
                r && g.u8(g.nk)(void 0, e, r, [g.se(n)])
            }
        }
        Q = Q.getElementsByTagName("annotation");
        for (n = 0; n < Q.length; n++) {
            var f = olZ(d, Q[n]);
            e = null;
            try {
                a: {
                    if (!f) {
                        e = null;
                        break a
                    }
                    var T = f.id;
                    r = /.+/;
                    let G = typeof T === "string" && r != null && T != null && T.match(r) ? T : ""
                      , O = yk(f.type, a6Z)
                      , P = yk(f.style, Uo0)
                      , D = gpZ(f.data)
                      , W = D.length !== 0 ? JSON.parse(D) : {};
                    b: {
                        var B = f.action;
                        r = W52;
                        if (B == null) {
                            var p = null;
                            break b
                        }
                        if (g.ik(B)) {
                            f = [];
                            for (let u of B) {
                                let I = r(u);
                                I && f.push(I)
                            }
                            p = f;
                            break b
                        }
                        let q = r(B);
                        p = q ? [q] : []
                    }
                    r = p;
                    e = G && O ? new Km2(G,O,P,r,W) : null
                }
            } catch (G) {}
            if (e)
                if (e.type === "branding" || e.type === "promotion") {
                    r = d;
                    f = e;
                    var K = p$2(r)
                      , A = null;
                    switch (f.type) {
                    case "branding":
                        if (r.player.B().Hb)
                            break;
                        A = f.HV();
                        if (A?.value) {
                            var R = g.Yp(A.value);
                            !R.Z && R.N.startsWith("/") && (g.JK(R, "www.youtube.com"),
                            g.Fe(R, "https"),
                            A.value = R.toString())
                        }
                        r.player.V("web_player_overlay_positioned_layout") ? (K.setAttribute("data-overlay-order", "11"),
                        r.player.sR(K, 4, !0)) : r.N.element.appendChild(K);
                        A = new A09(K,Q0(r),f);
                        break;
                    case "promotion":
                        g.OG(r.player, K, 4),
                        A = new l66(K,Q0(r),f)
                    }
                    A && A.ZN();
                    if (r = A)
                        g.X(d, r),
                        d.G[e.id] = r
                } else if (e.type === "card" || e.type === "drawer") {
                    d.Z || (d.Z = RIh(d),
                    g.X(d, d.Z));
                    if (e.type === "card") {
                        if (K = d.Z,
                        R = (t = e) && t.data && t.data.card_type,
                        e = t.data,
                        R)
                            switch (r = e.tracking || {},
                            r = {
                                rD: r.impression,
                                click: r.click,
                                close: r.close,
                                s9: r.teaser_impression,
                                PS: r.teaser_click
                            },
                            f = e.tracking_params || {},
                            A = null,
                            R) {
                            case "collaborator":
                                t = {
                                    id: t.id,
                                    timestamp: e.timestamp || 0,
                                    type: e.card_type,
                                    teaserText: e.teaser_text,
                                    teaserDurationMs: e.teaser_duration_ms,
                                    startMs: e.start_ms,
                                    autoOpen: e.auto_open || !1,
                                    sessionData: e.session_data || {},
                                    sponsored: e.sponsored || !1,
                                    EK: r,
                                    e_: f.card ? g.se(f.card) : null,
                                    oR: f.teaser ? g.se(f.teaser) : null,
                                    Xn: f.icon ? g.se(f.icon) : null,
                                    channelId: e.channel_id,
                                    customMessage: e.custom_message ? e.custom_message : null,
                                    profileImageUrl: e.image_url,
                                    title: e.title,
                                    metaInfo: e.meta_info,
                                    url: Nm({
                                        pause_on_navigation: e.pause_on_navigation,
                                        target: e.target || "new",
                                        value: e.url
                                    }),
                                    onClickCommand: null
                                };
                                Vk(K, t);
                                break;
                            case "playlist":
                                t = {
                                    id: t.id,
                                    timestamp: e.timestamp || 0,
                                    type: e.card_type,
                                    teaserText: e.teaser_text,
                                    teaserDurationMs: e.teaser_duration_ms,
                                    startMs: e.start_ms,
                                    autoOpen: e.auto_open || !1,
                                    sessionData: e.session_data || {},
                                    sponsored: e.sponsored || !1,
                                    EK: r,
                                    e_: f.card ? g.se(f.card) : null,
                                    oR: f.teaser ? g.se(f.teaser) : null,
                                    Xn: f.icon ? g.se(f.icon) : null,
                                    WQ: e.image_url,
                                    playlistVideoCount: e.playlist_video_count,
                                    customMessage: e.custom_message ? e.custom_message : null,
                                    title: e.title,
                                    metaInfo: e.meta_info,
                                    url: Nm({
                                        pause_on_navigation: e.pause_on_navigation,
                                        target: e.target || "new",
                                        value: e.url
                                    }),
                                    onClickCommand: null
                                };
                                Vk(K, t);
                                break;
                            case "productListing":
                                e.signin_url && (A = Nm({
                                    target: "current",
                                    value: e.signin_url
                                }));
                                R = [];
                                let G = e.offers || [];
                                for (let O = 0; O < G.length; O++)
                                    R.push(new GM$(g.aA(G[O].merchant),g.aA(G[O].price)));
                                t = {
                                    id: t.id,
                                    timestamp: e.timestamp || 0,
                                    type: e.card_type,
                                    teaserText: e.teaser_text,
                                    teaserDurationMs: e.teaser_duration_ms,
                                    startMs: e.start_ms,
                                    autoOpen: e.auto_open || !1,
                                    sessionData: e.session_data || {},
                                    sponsored: e.sponsored || !1,
                                    EK: r,
                                    e_: f.card ? g.se(f.card) : null,
                                    oR: f.teaser ? g.se(f.teaser) : null,
                                    Xn: f.icon ? g.se(f.icon) : null,
                                    imageUrl: e.image_url,
                                    displayDomain: e.display_domain ? e.display_domain : null,
                                    showLinkIcon: !!e.show_link_icon,
                                    fT: e.button_icon_url ? e.button_icon_url : null,
                                    title: e.title,
                                    customMessage: e.custom_message ? e.custom_message : null,
                                    url: Nm({
                                        pause_on_navigation: e.pause_on_navigation,
                                        target: e.target || "new",
                                        value: e.url
                                    }),
                                    I9l: A,
                                    SVN: e.signin_title ? e.signin_title : void 0,
                                    jRi: e.signin_message ? e.signin_message : void 0,
                                    offers: R,
                                    onClickCommand: null
                                };
                                Vk(K, t);
                                break;
                            case "simple":
                                t = {
                                    id: t.id,
                                    timestamp: e.timestamp || 0,
                                    type: e.card_type,
                                    teaserText: e.teaser_text,
                                    teaserDurationMs: e.teaser_duration_ms,
                                    startMs: e.start_ms,
                                    autoOpen: e.auto_open || !1,
                                    sessionData: e.session_data || {},
                                    sponsored: e.sponsored || !1,
                                    EK: r,
                                    e_: f.card ? g.se(f.card) : null,
                                    oR: f.teaser ? g.se(f.teaser) : null,
                                    Xn: f.icon ? g.se(f.icon) : null,
                                    imageUrl: e.image_url,
                                    displayDomain: e.display_domain ? e.display_domain : null,
                                    showLinkIcon: !!e.show_link_icon,
                                    fT: e.button_icon_url ? e.button_icon_url : null,
                                    title: e.title,
                                    customMessage: e.custom_message ? e.custom_message : null,
                                    url: Nm({
                                        pause_on_navigation: e.pause_on_navigation,
                                        target: e.target || "new",
                                        value: e.url
                                    }),
                                    onClickCommand: null
                                };
                                Vk(K, t);
                                break;
                            case "video":
                                t = {
                                    id: t.id,
                                    timestamp: e.timestamp || 0,
                                    type: e.card_type,
                                    teaserText: e.teaser_text,
                                    teaserDurationMs: e.teaser_duration_ms,
                                    startMs: e.start_ms,
                                    autoOpen: e.auto_open || !1,
                                    sessionData: e.session_data || {},
                                    sponsored: e.sponsored || !1,
                                    EK: r,
                                    e_: f.card ? g.se(f.card) : null,
                                    oR: f.teaser ? g.se(f.teaser) : null,
                                    Xn: f.icon ? g.se(f.icon) : null,
                                    WQ: e.image_url,
                                    videoDuration: e.video_duration || null,
                                    customMessage: e.custom_message ? e.custom_message : null,
                                    title: e.title,
                                    metaInfo: e.meta_info,
                                    isLiveNow: !!e.is_live_now,
                                    url: Nm({
                                        pause_on_navigation: e.pause_on_navigation,
                                        target: e.target || "new",
                                        value: e.url
                                    }),
                                    onClickCommand: null
                                },
                                Vk(K, t)
                            }
                    } else
                        cKh(d.Z, e);
                    t = !0
                }
        }
        t && (U8(d.player),
        d.K())
    }
      , kMh = function(d) {
        var Q = d.player.B();
        d = d.player.getVideoData();
        return (Q.annotationsLoadPolicy || d.annotationsLoadPolicy) === 1 && !d.fY || Q.Xf.get(d.videoId) || g.N4(d) || g.XK(d) ? !0 : !1
    }
      , i0G = function(d, Q) {
        Q = !Q.isCued() && !Q.Uh(1024);
        d.N.Qq(Q);
        d.D.Qq(Q)
    }
      , vlo = function(d, Q) {
        var t = Q.videoId
          , n = r => {
            var f = d.loadNumber;
            d.U = null;
            d.loaded && d.loadNumber === f && d.player.getVideoData().videoId === t && (r = g.TD(r) && r.responseXML ? r.responseXML : null) && (tq(d, r),
            g.A0(d.player.getRootNode(), "iv-module-loaded"))
        }
        ;
        g.W9() && (n = w$G(d, n));
        var e = {
            format: "XML",
            onFinish: n,
            onError: () => {
                d.U = null
            }
            ,
            urlParams: {}
        };
        Q.isPharma && (e.urlParams.pharma = "1");
        e.method = "POST";
        e.withCredentials = !0;
        (n = d.player.B().Xf.get(t)) && O0e(e, n);
        n = n && n.TV;
        if (!Q.jP || n)
            d.W = () => {
                if (!d.Qd)
                    d.onVideoDataChange(e);
                var r = d.player.getVideoData();
                g.yW(r) && !d.mq && H0e(d, r)
            }
            ,
            d.player.addEventListener("videodatachange", d.W)
    }
      , nw = function(d, Q) {
        var t = !1;
        d.Z || (d.Z = RIh(d),
        g.X(d, d.Z));
        for (var n of Q.cards || [])
            n.cardRenderer && (doG(d.Z, n.cardRenderer),
            t = !0);
        t && (g.yW(d.player.getVideoData()) || (t = d.Z,
        n = Q.headerText ? g.Ov(Q.headerText) : "",
        g.Ah(t.Sm, n),
        t.L && t.L.setAttribute("data-tooltip-title", n),
        t.context.videoData.eventId && (t.eventId = t.context.videoData.eventId),
        t.Vd = Q.trackingParams ? g.se(Q.trackingParams) : null,
        t.U = Q.closeButton.infoCardIconRenderer.trackingParams ? g.se(Q.closeButton.infoCardIconRenderer.trackingParams) : null,
        t.Xn = Q.icon.infoCardIconRenderer.trackingParams ? g.se(Q.icon.infoCardIconRenderer.trackingParams) : null,
        d.K()),
        U8(d.player))
    }
      , H0e = function(d, Q) {
        if (Q = Q.getWatchNextResponse()?.cards?.cardCollectionRenderer)
            d.mq = !0,
            nw(d, Q),
            Q.headerText && d.e7 && (Q = g.Ov(Q.headerText),
            d.e7.setAttribute("data-tooltip-title", Q))
    }
      , w$G = function(d, Q) {
        return (...t) => {
            d.GM() || d.ZN.push(g.QQ.uL( () => {
                Q(...t)
            }
            ))
        }
    }
      , O0e = function(d, Q) {
        d.method = "POST";
        d.postParams = d.postParams || {};
        Q.TV && (d.postParams.ic_coll = Q.TV);
        Q.DX && (d.postParams.ic_track = Q.DX)
    }
      , olZ = function(d, Q) {
        var t = {};
        for (var n of Q.attributes)
            t[n.name] = n.nodeValue;
        for (n = 0; n < Q.childNodes.length; n++) {
            let r = Q.childNodes[n];
            if (!g.w4(r) || r.nodeType != 1)
                continue;
            var e = void 0;
            if (t[r.tagName])
                e = t[r.tagName];
            else if (r.tagName === "data") {
                r.childNodes.length > 0 && (e = r.childNodes[0].nodeValue,
                t[r.tagName] = typeof e === "string" ? e.trim() : e);
                continue
            } else
                e = [],
                t[r.tagName] = e;
            r && r.tagName === "TEXT" ? r.childNodes.length === 1 && r.childNodes[0].nodeType === 3 ? e.push(r.childNodes[0].nodeValue) : e.push("") : r && e.push(olZ(d, r))
        }
        return t
    }
      , Q0 = function(d) {
        if (!d.L) {
            let Q = new zI0(d);
            g.X(d, Q);
            let t = new g.ui(d);
            g.X(d, t);
            d.L = new mo6(Q,t,d.player.B(),d.player.getVideoData(),d.logger,d.player,d.Ju)
        }
        return d.L
    }
      , hIH = function(d) {
        var Q = d.player.getVideoData();
        if (Q.L6) {
            var t = d.player.B().Xf.get(Q.videoId);
            if (t) {
                var n = {
                    format: "XML",
                    urlParams: {},
                    method: "POST",
                    withCredentials: !0,
                    onFinish: (e, r, f) => {
                        e = d.loadNumber;
                        r = Q.videoId;
                        d.loaded && d.loadNumber === e && d.player.getVideoData().videoId === r && (f = g.TD(f) && f.responseXML ? f.responseXML : null) && tq(d, f)
                    }
                };
                g.W9() && (n.onFinish = w$G(d, n.onFinish));
                n.postParams = {
                    ic_only: "1"
                };
                O0e(n, t);
                d.Qd = !0;
                g.a9(Q.L6, n)
            }
        }
    }
      , RIh = function(d) {
        var Q = new g.dP({
            S: "div"
        });
        g.Qf(Q.element, !1);
        var t = new Fmh(d.player,Q.element,Q0(d));
        g.X(t, Q);
        Q.wj(d.N.element);
        t.ZN();
        return t
    }
      , J06 = function(d, Q, t, n, e) {
        if (!d.player.B().Hb) {
            var r = [];
            Q.navigationEndpoint && g.E(Q.navigationEndpoint, g.j_) && g.E(Q.navigationEndpoint, g.j_).browseId && r.push(new Dz2("openUrl","click",new NT$(`/channel/${g.E(Q.navigationEndpoint, g.j_).browseId}`,"new",!0,!0)));
            var f = Q.watermark.thumbnails[0];
            n = {
                channel_name: Q.channelName,
                end_ms: Q.endTimeMs,
                image_height: f.height,
                image_type: 1,
                image_url: f.url,
                image_width: f.width,
                is_mobile: !1,
                session_data: {
                    annotation_id: t,
                    ei: e,
                    feature: "iv",
                    itct: Q.trackingParams,
                    src_vid: n
                },
                start_ms: Q.startTimeMs
            };
            if (Q.subscribeButton && g.E(Q.subscribeButton, g.p8)) {
                n.channel_id = g.E(Q.subscribeButton, g.p8).channelId;
                Q = g.E(Q.subscribeButton, g.p8);
                f = e = null;
                Q.subscribed ? (Q.subscriberCountWithUnsubscribeText && (e = g.Ov(Q.subscriberCountWithUnsubscribeText)),
                Q.subscriberCountText && (f = g.Ov(Q.subscriberCountText))) : (Q.subscriberCountText && (e = g.Ov(Q.subscriberCountText)),
                Q.subscriberCountWithSubscribeText && (f = g.Ov(Q.subscriberCountWithSubscribeText)));
                let T = g.E(Q.signInEndpoint?.commandMetadata, g.dw)?.url || "";
                Q = {
                    subscribeText: g.Ov(Q.unsubscribedButtonText),
                    subscribeCount: e || "",
                    unsubscribeText: g.Ov(Q.subscribedButtonText),
                    unsubscribeCount: f || "",
                    enabled: Q.enabled || !1,
                    classic: !1,
                    subscribed: Q.subscribed || !1,
                    feature: "iv",
                    signInUrl: T
                };
                n.standalone_subscribe_button_data = Q
            }
            r = new Km2(t,"branding","branding",r,n);
            n = p$2(d);
            d.player.V("web_player_overlay_positioned_layout") ? (n.setAttribute("data-overlay-order", "11"),
            d.player.sR(n, 4, !0)) : d.N.element.appendChild(n);
            r = new A09(n,Q0(d),r);
            r.ZN();
            g.X(r, r);
            d.G[t] = r
        }
    };
    g.Tf.prototype.qY = g.t9(41, function(d, Q) {
        var t = g.Nx(this.wW());
        t && t.qY(d, Q)
    });
    var AA = {}
      , lK = null;
    g.PV(GL, g.i4);
    g.J = GL.prototype;
    g.J.getDuration = function() {
        return this.duration
    }
    ;
    g.J.play = function(d) {
        if (d || this.Z == 0)
            this.progress = 0,
            this.coords = this.N;
        else if (this.isPlaying())
            return !1;
        RV(this);
        this.startTime = d = g.h9();
        this.isPaused() && (this.startTime -= this.duration * this.progress);
        this.endTime = this.startTime + this.duration;
        this.W = this.startTime;
        this.progress || this.VZ();
        this.n$("play");
        this.isPaused() && this.n$("resume");
        this.Z = 1;
        var Q = g.HV(this);
        Q in AA || (AA[Q] = this);
        AKo();
        ln$(this, d);
        return !0
    }
    ;
    g.J.stop = function(d) {
        RV(this);
        this.Z = 0;
        d && (this.progress = 1);
        RL$(this, this.progress);
        this.onStop();
        this.wY()
    }
    ;
    g.J.pause = function() {
        this.isPlaying() && (RV(this),
        this.Z = -1,
        this.n$("pause"))
    }
    ;
    g.J.DN = function() {
        this.Z == 0 || this.stop(!1);
        this.n$("destroy");
        GL.Eb.DN.call(this)
    }
    ;
    g.J.destroy = function() {
        this.dispose()
    }
    ;
    g.J.BC = function() {
        this.n$("animate")
    }
    ;
    g.J.n$ = function(d) {
        this.dispatchEvent(new Gbe(d,this))
    }
    ;
    g.PV(Gbe, g.Xq);
    g.PV(kW, GL);
    kW.prototype.D = function() {}
    ;
    kW.prototype.BC = function() {
        this.D();
        kW.Eb.BC.call(this)
    }
    ;
    kW.prototype.wY = function() {
        this.D();
        kW.Eb.wY.call(this)
    }
    ;
    kW.prototype.VZ = function() {
        this.D();
        kW.Eb.VZ.call(this)
    }
    ;
    g.PV(iK, kW);
    iK.prototype.D = function() {
        this.element.style.left = Math.round(this.coords[0]) + "px";
        this.element.style.top = Math.round(this.coords[1]) + "px"
    }
    ;
    var zI0 = class extends g.Qw {
        constructor(d) {
            super();
            this.N = d || window;
            this.Z = []
        }
        listen(d, Q, t, n) {
            t = (0,
            g.vV)(t, n || this.N);
            d = g.ay(d, Q, t);
            this.Z.push(d);
            return d
        }
        kg(d, Q, t, n) {
            t = (0,
            g.vV)(t, n || this.N);
            d = UzH(d, Q, t);
            this.Z.push(d);
            return d
        }
        lA(d) {
            g.UP(d);
            g.f$(this.Z, d)
        }
        removeAll() {
            g.UP(this.Z);
            this.Z.length = 0
        }
        DN() {
            this.removeAll();
            super.DN()
        }
    }
    ;
    var hLz = class extends g.dP {
        constructor(d, Q, t, n, e, r, f, T, B, p, K) {
            d = d.charAt(0) + d.substring(1).toLowerCase();
            t = t.charAt(0) + t.substring(1).toLowerCase();
            if (Q === "0" || Q === "-1")
                Q = null;
            if (n === "0" || n === "-1")
                n = null;
            var A = K.B()
              , R = A.userDisplayName && g.CE(A);
            super({
                S: "div",
                dj: ["ytp-button", "ytp-sb"],
                A: [{
                    S: "div",
                    O: "ytp-sb-subscribe",
                    C: R ? {
                        "data-tooltip-title": g.Mr("Subscribe as $USER_NAME", {
                            USER_NAME: A.userDisplayName
                        }),
                        "aria-label": "Subscribe to channel",
                        "data-tooltip-image": g.KW(A),
                        "data-tooltip-opaque": String(g.cs(A)),
                        tabindex: "0",
                        role: "button"
                    } : {
                        "aria-label": "Subscribe to channel"
                    },
                    A: [{
                        S: "div",
                        O: "ytp-sb-text",
                        A: [{
                            S: "div",
                            O: "ytp-sb-icon"
                        }, d]
                    }, Q ? {
                        S: "div",
                        O: "ytp-sb-count",
                        Wi: Q
                    } : ""]
                }, {
                    S: "div",
                    O: "ytp-sb-unsubscribe",
                    C: R ? {
                        "data-tooltip-title": g.Mr("Subscribed as $USER_NAME", {
                            USER_NAME: A.userDisplayName
                        }),
                        "aria-label": "Unsubscribe to channel",
                        "data-tooltip-image": g.KW(A),
                        "data-tooltip-opaque": String(g.cs(A)),
                        tabindex: "0",
                        role: "button"
                    } : {
                        "aria-label": "Unsubscribe to channel"
                    },
                    A: [{
                        S: "div",
                        O: "ytp-sb-text",
                        A: [{
                            S: "div",
                            O: "ytp-sb-icon"
                        }, t]
                    }, n ? {
                        S: "div",
                        O: "ytp-sb-count",
                        Wi: n
                    } : ""]
                }],
                C: {
                    "aria-live": "polite"
                }
            });
            this.channelId = f;
            this.Y = K;
            var G = this.IM("ytp-sb-subscribe")
              , O = this.IM("ytp-sb-unsubscribe");
            r && g.A0(this.element, "ytp-sb-classic");
            if (e) {
                T ? this.Z() : this.N();
                var P = () => {
                    if (A.Vd) {
                        var W = this.channelId;
                        if (B || p) {
                            var q = {
                                c: W
                            };
                            var u;
                            g.hG.isInitialized() && (u = g.zQi(q));
                            q = u || "";
                            if (u = K.getVideoData())
                                if (u = u.subscribeCommand) {
                                    var I = K.R1();
                                    I ? (g.B4(I, u, {
                                        botguardResponse: q,
                                        feature: B
                                    }),
                                    g.QK(K, "SUBSCRIBE", W)) : g.Sj(Error("No innertube service available when updating subscriptions."))
                                } else
                                    g.Sj(Error("No subscribe command in videoData."));
                            else
                                g.Sj(Error("No video data available when updating subscription."))
                        }
                        O.focus();
                        O.removeAttribute("aria-hidden");
                        G.setAttribute("aria-hidden", "true")
                    } else
                        g.Zz(g.tx(this.Y.B()), "sb_button", this.D)
                }
                  , D = () => {
                    var W = this.channelId;
                    if (B || p) {
                        var q = K.getVideoData();
                        g.B4(K.R1(), q.unsubscribeCommand, {
                            feature: B
                        });
                        g.QK(K, "UNSUBSCRIBE", W)
                    }
                    G.focus();
                    G.removeAttribute("aria-hidden");
                    O.setAttribute("aria-hidden", "true")
                }
                ;
                this.X(G, "click", P);
                this.X(O, "click", D);
                this.X(G, "keypress", W => {
                    W.keyCode === 13 && P(W)
                }
                );
                this.X(O, "keypress", W => {
                    W.keyCode === 13 && D(W)
                }
                );
                this.X(K, "SUBSCRIBE", this.Z);
                this.X(K, "UNSUBSCRIBE", this.N)
            } else
                g.A0(G, "ytp-sb-disabled"),
                g.A0(O, "ytp-sb-disabled")
        }
        D() {
            window.location.reload()
        }
        Z() {
            g.A0(this.element, "ytp-sb-subscribed")
        }
        N() {
            g.Rh(this.element, "ytp-sb-subscribed")
        }
    }
    ;
    var N8z = class extends g.Jn {
        constructor(d) {
            super(d);
            this.W = this.endscreen = null;
            this.N = {};
            this.G = {};
            this.j = this.D = null;
            this.L = [];
            this.Z = null;
            this.mq = !0;
            this.U = 0;
            d = d.B();
            this.K = g.CE(d) || d.NZ === "profilepage";
            this.events = new g.ZY(this);
            g.X(this, this.events);
            this.events.X(this.player, g.Ep("creatorendscreen"), this.onCueRangeEnter);
            this.events.X(this.player, g.ua("creatorendscreen"), this.onCueRangeExit);
            this.events.X(this.player, "resize", this.hy);
            this.events.X(window, "focus", this.Qd);
            this.load();
            var Q = g.BP("STYLE");
            (g.IA("HEAD")[0] || document.body).appendChild(Q);
            this.addOnDisposeCallback( () => {
                g.UL(Q)
            }
            );
            Q.sheet && (Q.sheet.insertRule(".ytp-ce-playlist-icon {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAIVBMVEVMaXGzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7P///91E4wTAAAACXRSTlMArBbpVOtYrReN+x2FAAAAAWJLR0QKaND0VgAAACFJREFUCNdjYCAWzIQAFBaZ6hgVYLKcJnBWGEyWvYGASwCXtBf7m4i3CQAAAABJRU5ErkJggg==) no-repeat center;background-size:18px;width:18px;height:18px}", 0),
            Q.sheet.insertRule(".ytp-ce-size-853 .ytp-ce-playlist-icon, .ytp-ce-size-1280 .ytp-ce-playlist-icon, .ytp-ce-size-1920 .ytp-ce-playlist-icon {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAJ1BMVEVMaXGzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7P///9RfzIKAAAAC3RSTlMAvDeyLvxYtDK9Ogx4T1QAAAABYktHRAyBs1FjAAAAK0lEQVQY02NgoBjshgO8HJoYwKiAMGAD92YHJM7uMCTO9gaEHs4FlPuZAQC8Fj8x/xHjxwAAAABJRU5ErkJggg==) no-repeat center;background-size:24px;width:24px;height:24px}", 0))
        }
        load() {
            super.load();
            if (!vw(this)) {
                var d = g.ACP(this.player.getVideoData());
                d ? (d = Hw(d, OL$(this)),
                zL(this, d, !1)) : mzG(this)
            }
        }
        unload() {
            zL(this, null);
            this.W && (this.W.abort(),
            this.W = null);
            super.unload()
        }
        Ka(d, Q) {
            return vw(this) ? d === "loadCustomEndscreenRenderer" ? (d = Hw(Q, "new"),
            zL(this, d),
            !0) : null : null
        }
        getOptions() {
            return vw(this) ? ["loadCustomEndscreenRenderer"] : []
        }
        hy() {
            if (this.endscreen && this.endscreen.elements) {
                var d = this.player.getVideoContentRect();
                if (d && d.width !== 0 && d.height !== 0) {
                    var Q = this.player.getPlayerSize();
                    if (Q && Q.width !== 0 && Q.height !== 0) {
                        var t = d.width / d.height;
                        var n = 0;
                        var e = -1;
                        for (var r = 0; r < P4h.length; r++) {
                            var f = Math.abs(Q.width - P4h[r]);
                            if (e === -1 || n >= f)
                                e = r,
                                n = f
                        }
                        n = shz[e];
                        this.D && g.YE(this.D.element, "outline-width", Math.max(Q.width, Q.height) + "px");
                        for (Q = 0; Q < this.endscreen.elements.length; ++Q) {
                            r = this.endscreen.elements[Q].id;
                            e = this.N[r];
                            f = this.G[r];
                            if (!e || !f)
                                continue;
                            let B = f.width * t / f.aspectRatio;
                            var T = Math.round(f.width * d.width);
                            r = Math.round(B * d.height);
                            let p = d.left + Math.round(f.left * d.width)
                              , K = d.top + Math.round(f.top * d.height);
                            g.di(e.element, T, r);
                            g.M$(e.element, p, K);
                            g.GM(e.element, glO);
                            T > 256 || r > 256 ? g.A0(e.element, "ytp-ce-large-round") : T > 96 || r > 96 ? g.A0(e.element, "ytp-ce-medium-round") : g.A0(e.element, "ytp-ce-small-round");
                            g.GM(e.element, y0O);
                            T = f.left + f.width / 2;
                            f = f.top + B / 2;
                            g.A0(e.element, T <= .5 && f <= .5 ? "ytp-ce-top-left-quad" : T > .5 && f <= .5 ? "ytp-ce-top-right-quad" : T <= .5 && f > .5 ? "ytp-ce-bottom-left-quad" : "ytp-ce-bottom-right-quad");
                            g.GM(e.element, shz);
                            g.A0(e.element, n);
                            (e = g.Ce(document, "div", "ytp-ce-expanding-overlay-body", e.element)[0]) && g.YE(e, "height", `${r}px`)
                        }
                    }
                }
            }
        }
        onCueRangeEnter(d) {
            if (this.endscreen)
                if (d.getId() === "ytp-ce-in-endscreen")
                    s8(this, this.endscreen.impressionUrls),
                    (d = g.Xz()) && this.endscreen.visualElement && g.og(d, this.endscreen.visualElement),
                    this.Z && (g.A0(this.Z, "ytp-ce-element-show"),
                    this.Z.removeAttribute("aria-hidden"),
                    this.player.bb() ? g.A0(this.Z, "ytp-ce-hide-button-lower") : g.Rh(this.Z, "ytp-ce-hide-button-lower"));
                else {
                    d = d.getId().substring(15);
                    var Q = this.N[d]
                      , t = this.G[d];
                    g.A0(Q.element, "ytp-ce-element-show");
                    Q.element.removeAttribute("aria-hidden");
                    Q = this.player.getRootNode();
                    g.A0(Q, "ytp-ce-shown");
                    s8(this, t.impressionUrls);
                    (Q = g.Xz()) && g.og(Q, t.visualElement);
                    this.player.B().mq && g.QK(this.player, "endscreenelementshown", d)
                }
        }
        onCueRangeExit(d) {
            if (d.getId() === "ytp-ce-in-endscreen")
                this.Z && (g.Rh(this.Z, "ytp-ce-element-show"),
                this.Z.setAttribute("aria-hidden", "true"));
            else {
                d = d.getId().substring(15);
                var Q = this.N[d];
                g.Rh(Q.element, "ytp-ce-element-show");
                Q.element.setAttribute("aria-hidden", "true");
                Q = this.player.getRootNode();
                g.Rh(Q, "ytp-ce-shown");
                this.player.B().mq && g.QK(this.player, "endscreenelementhidden", d)
            }
        }
        Qd(d) {
            d.target === window && (new g.B$( () => {
                for (let Q of Object.values(this.N))
                    g.GM(Q.element, ["ytp-ce-force-expand", "ytp-ce-element-hover", "ytp-ce-element-shadow-show"])
            }
            ,0)).start()
        }
        Qq(d) {
            for (let Q of Object.values(this.N))
                d ? Q.element.setAttribute("hidden", "") : Q.element.removeAttribute("hidden")
        }
        B3(d) {
            this.Z && this.player.getRootNode().removeChild(this.Z);
            d && (g.A0(d, "ytp-ce-hide-button-container"),
            this.Z = d,
            g.OG(this.player, this.Z, 4))
        }
    }
      , P4h = [346, 426, 470, 506, 570, 640, 853, 1280, 1920]
      , shz = "ytp-ce-size-346 ytp-ce-size-426 ytp-ce-size-470 ytp-ce-size-506 ytp-ce-size-570 ytp-ce-size-640 ytp-ce-size-853 ytp-ce-size-1280 ytp-ce-size-1920".split(" ")
      , y0O = ["ytp-ce-top-left-quad", "ytp-ce-top-right-quad", "ytp-ce-bottom-left-quad", "ytp-ce-bottom-right-quad"]
      , glO = ["ytp-ce-small-round", "ytp-ce-medium-round", "ytp-ce-large-round"];
    var NT$ = class {
        constructor(d, Q, t, n) {
            this.value = d;
            this.target = Q;
            this.showLinkIcon = t;
            this.N = n
        }
        Z() {
            return this.value ? this.value : null
        }
    }
      , yK6 = {
        HIq: "current",
        kAj: "new"
    };
    var Dz2 = class {
        constructor(d, Q, t) {
            this.type = d;
            this.trigger = Q;
            this.url = t
        }
    }
      , XNe = {
        CLOSE: "close",
        Kyj: "openUrl",
        SUBSCRIBE: "subscribe"
    }
      , YH0 = {
        iII: "click",
        CLOSE: "close",
        m2Z: "hidden",
        Zmf: "rollOut",
        mQq: "rollOver",
        UQZ: "shown"
    };
    var Km2 = class {
        constructor(d, Q, t, n, e) {
            this.id = d;
            this.type = Q;
            this.style = t;
            this.data = e;
            this.action = n || []
        }
        HV() {
            var d = Eph(this, Q => Q.type === "openUrl" && Q.url != null);
            return d ? d.url : null
        }
    }
      , Uo0 = {
        T5: "anchored",
        QC: "branding",
        CHANNEL: "channel",
        Jhj: "cta",
        tlN: "highlightText",
        s7j: "label",
        PLAYLIST: "playlist",
        POPUP: "popup",
        ESd: "speech",
        SUBSCRIBE: "subscribe",
        MFD: "title",
        VIDEO: "video",
        qDq: "website"
    }
      , a6Z = {
        QC: "branding",
        BjH: "card",
        S4M: "drawer",
        D2i: "highlight",
        VOj: "marker",
        V5f: "promotion",
        TEXT: "text",
        K7Z: "widget"
    };
    var X$V = [".iv-promo .iv-promo-contents .iv-promo-txt .iv-promo-link:after {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAHlBMVEVMaXH////////////////////////////////////Z6AnKAAAACXRSTlMA+/A2IuI1mJIldm0CAAAAAWJLR0QB/wIt3gAAAEVJREFUCNdjYGCYCQUMBJlACOIzIDElIcyZkwxgojOVWWDMSQauMKYySySUOSnBdSaUOZ0lEsac2YqwYiZ+JhwgM7E5HACgzVCI/YJ59AAAAABJRU5ErkJggg==) no-repeat center;background-size:10px;width:10px;height:10px}", ".iv-promo .iv-promo-actions .iv-promo-close:after {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJBAMAAAASvxsjAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAJFBMVEVMaXH///////////////////////////////////////////9tKdXLAAAAC3RSTlMAVaQDpaimqQbl5rjXUFUAAAABYktHRAH/Ai3eAAAAPUlEQVQI12MQMmAwEmDwDmaOTmAw39663YCBuXp2MQMDQ+fOBgYG5ujVwQwMptvbgeLaxczVCQwiBgxmAgBkXg1FN5iwiAAAAABJRU5ErkJggg==) no-repeat center;background-size:9px;width:9px;height:9px}", ".iv-promo .iv-promo-actions .iv-promo-expand:after {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAJBAMAAADnQZCTAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAJFBMVEVMaXHMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMz////eMKB4AAAAC3RSTlMAOpE7k5Uvj5kpfRaQSaQAAAABYktHRAsf18TAAAAAHklEQVQI12MQYGBQZmBwTWCo0GSo6AKRQDZQRIABADXXA/UkIpvtAAAAAElFTkSuQmCC) no-repeat center;background-size:4px 9px;width:4px;height:9px}", ".iv-promo-website-card-cta-redesign .iv-promo-round-expand-icon:after {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgCgUUEztsNfqrAAAAXklEQVRYw+3Uuw2AQAwEUUNXfBpDIvBRMhQwJJAScNrA0r4CdiQHjjAzK4NGKucPAFmCnZcmwcTphBNO9CTGH4VB+/Zm6YlYis9fhedXz38FNvFriCCl808iw8ysrBu65gCeuV/CfgAAAABJRU5ErkJggg==) no-repeat center;background-size:18px 18px;width:18px;height:18px}", ".iv-card-link-icon {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAGFBMVEVMaXG7u7u7u7u7u7u7u7u7u7u7u7v///+WKTAlAAAABnRSTlMAFdQWbGj9GiOuAAAAAWJLR0QHFmGI6wAAAEhJREFUCNdjYACBNCBgQGMxMKrBWEJJaRAJRjVlKEsoSQDIAqtSZICwgEIQFkgIZBRECMxiBqsCsVjAqsCygQwwFgMeFgQgswBg2xjLrfC4mgAAAABJRU5ErkJggg==) no-repeat center;background-size:9px;width:9px;height:9px}", ".iv-card-playlist-video-count:after {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAJFBMVEVMaXH///////////////////////////////////////////9tKdXLAAAAC3RSTlMAvDeyLvxYtDK9Ogx4T1QAAAABYktHRAH/Ai3eAAAAK0lEQVQY02NgoBjshgO8HJoYwKiAMGAD92YHJM7uMCTO9gaEHs4FlPuZAQC8Fj8x/xHjxwAAAABJRU5ErkJggg==) no-repeat center;background-size:24px;width:24px;height:24px}"]
      , Y9h = [".iv-drawer-close-button:after {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMAgMAAAArG7R0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACVBMVEVMaXH////////OZTV/AAAAAnRSTlMAoKBFbtAAAAABYktHRAH/Ai3eAAAAKUlEQVQI12MIYGBlSGGQBMIUBjbHCQyM0xwYGDIZwBjEBomB5EBqgGoBolQGzYuy51cAAAAASUVORK5CYII=) no-repeat center;background-size:12px;width:12px;height:12px}", ".iv-ad-info-icon {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAVFBMVEVMaXGUlJSYmJiZmZmYmJiXl5eZmZmZmZmWlpaVlZWOjo6ZmZmSkpKXl5eYmJiYmJiZmZmZmZmZmZmZmZmYmJiJiYmXl5eZmZmYmJiWlpaZmZn///+81lbeAAAAGnRSTlMAE5DM80DliTMMEjccWIM5p1UjaTQNgB5cLlr5mgUAAAABYktHRBsCYNSkAAAAVElEQVQI102NRw7AIBADhw7ppIf/PzQLJ/ZgWSNrFlDaWKMVcs6HmGLwTqjEME6CFDrAXBYIGhNh3TJEg02wHydctvFc7sbrvnXZV8/zfs3T+7u/P7CrAso35YfPAAAAAElFTkSuQmCC) no-repeat center;background-size:11px;width:11px;height:11px}", ".annotation-close-button {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAALVBMVEVMaXEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/Pz9aWloBAQGZmZlbW1v///+X9wUzAAAACHRSTlMANprf+g6lyRmB9hUAAAABYktHRA5vvTBPAAAAWUlEQVQI12NgYBAycVZkAIKwDiBIZWBgrQAx2gMY2DrAIIFBomPWju6VHY0MGh1rbu891dHEYNGx9+yd2x3NDB4d3XfO7uhoQTDgUnDFcO1wA+FWwC2FOQMAdKg6tUSAFEAAAAAASUVORK5CYII=) no-repeat center}", ".annotation-link-icon {background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAUVBMVEVMaXH////////////////////////////////////////////////////////////////////////////////////////////////////////JzkR1AAAAGnRSTlMAfXf+c3xsdGdv/GJoXPtXXflSVk5L7DBH9VeFfsQAAAABYktHRAH/Ai3eAAAAgElEQVQ4y93SSQ6AIAwFULSOOOJs739Qf9SF0VA2uNCu+psHaQJK7cVCqY+Rg92PXA++Q84KnCR03UIRJrFEKMEgZYFQhpyzQHSBWJJAdIVUENtJ3SC0mu3EdOh7zXZiBrRdzQLJ0Y1GfOlpVstD3HaZktX9X/gvRCxvxL6FR7IBS1RTM5xIpLoAAAAASUVORK5CYII=) no-repeat center}"];
    var DoV = class {
        constructor(d, Q) {
            this.context = d;
            this.Z = Q
        }
    }
    ;
    var GM$ = class {
        constructor(d, Q) {
            this.merchant = d;
            this.price = Q
        }
    }
    ;
    var Wmh = class extends g.Qw {
        constructor(d, Q) {
            super();
            this.element = d;
            this.context = Q;
            this.Jh = !1;
            this.Pi = new Map;
            this.fI = new Map;
            this.context.Y.addEventListener(g.Ep("annotations_module"), t => {
                (t = this.Pi.get(t)) && t.apply(this)
            }
            );
            this.context.Y.addEventListener(g.ua("annotations_module"), t => {
                (t = this.fI.get(t)) && t.apply(this)
            }
            )
        }
        addCueRange(d, Q, t, n, e) {
            d = new g.yK(d,Q,{
                id: t,
                namespace: "annotations_module"
            });
            n && this.Pi.set(d, n);
            e && this.fI.set(d, e);
            this.context.Y.Va([d], 1)
        }
        ZN() {
            this.context.N.subscribe("resize", this.qZ, this)
        }
        GL() {
            return this.element
        }
        rj(d, Q, t, n, e, r) {
            if (this.Jh)
                return !1;
            r && (r.stopPropagation(),
            r.preventDefault());
            this.navigate(d, t, n, e);
            return !1
        }
        show() {}
        hide() {}
        destroy() {
            g.UL(this.GL())
        }
        qZ() {}
        navigate(d, Q, t, n) {
            var e = d.Z();
            if (e) {
                var r = bLh(e, d.target)
                  , f = () => {
                    d.N && this.context.Y.pauseVideo();
                    var T = this.context.videoData.OA || !1
                      , B = g.d3(e || "");
                    T && B && (B.v || B.list) ? this.context.Y.nk(B.v, Q, B.list, !1) : g.lW(e || "", r === "current" ? "_top" : void 0, Q)
                }
                ;
                r === "new" && (f(),
                f = null);
                $5(this.context.logger, t, f, n);
                qH2(e) || (t = g.Xz(),
                n = Q.itct,
                t && n && g.Kk(t, g.se(n)))
            }
        }
        DN() {
            this.Pi.clear();
            this.fI.clear();
            super.DN()
        }
        createElement(d) {
            d = new g.dP(d);
            g.X(this, d);
            return d.element
        }
    }
    ;
    var Fmh = class extends Wmh {
        constructor(d, Q, t) {
            super(Q, t);
            this.Y = d;
            this.eventId = null;
            this.IC = this.LI = this.V$ = this.D = this.isInitialized = !1;
            this.cards = [];
            this.y$ = this.L = this.Oh = this.j = this.TM = this.Z = null;
            this.mq = [];
            this.Qd = this.U = this.Xn = this.Vd = null;
            this.G = 0;
            this.jH = new g.B$( () => {}
            ,t.J.Bu ? 4E3 : 3E3);
            g.X(this, this.jH);
            this.KI = new g.B$( () => {}
            );
            g.X(this, this.KI);
            this.NZ = new DoV(t, (n, e, r, f, T, B) => {
                uK(this, n, e, r, f, T, B)
            }
            );
            this.K = new g.dP({
                S: "div",
                O: "iv-drawer",
                C: {
                    id: "iv-drawer"
                },
                A: [{
                    S: "div",
                    O: "iv-drawer-header",
                    C: {
                        "aria-role": "heading"
                    },
                    A: [{
                        S: "span",
                        O: "iv-drawer-header-text"
                    }, {
                        S: "button",
                        dj: ["iv-drawer-close-button", "ytp-button"],
                        C: {
                            "aria-label": "Hide cards",
                            tabindex: "0"
                        }
                    }]
                }, {
                    S: "div",
                    O: "iv-drawer-content"
                }]
            });
            g.X(this, this.K);
            this.W = this.K.element;
            this.xl = new g.P5(this.K,330);
            g.X(this, this.xl);
            this.Sm = g.x2("iv-drawer-header-text", this.W);
            this.N = g.x2("iv-drawer-content", this.W);
            this.addCueRange(0, t.videoData.lengthSeconds * 1E3, "", () => {
                this.V$ && Mm(this, "YOUTUBE_DRAWER_AUTO_OPEN")
            }
            , () => {
                (this.V$ = this.D) && IV(this)
            }
            );
            this.Xf = new g.ZY(this);
            g.X(this, this.Xf);
            this.Y.addEventListener("videodatachange", this.zv.bind(this))
        }
        zv() {
            this.Qd && Vk(this, this.Qd)
        }
        isAvailable() {
            var d;
            if (d = !!this.cards.length)
                (d = this.Y.getRootNode()) ? (d = g.$w(d),
                d = 173 < d.width && 173 < d.height) : d = !1;
            return d
        }
        qZ() {
            var d = this.isAvailable();
            g.Qf(this.GL(), d);
            g.kl(this.context.Y.getRootNode(), g.We.IV_DRAWER_ENABLED, d);
            U8(this.Y)
        }
        destroy() {
            this.Y.qY(!1);
            try {
                this.Y.getRootNode().removeChild(this.W)
            } catch (d) {}
            g.kH(this.mq);
            this.Xf.N();
            this.TM && this.TM.dispose();
            this.j && this.j.dispose();
            super.destroy()
        }
        Zw() {
            this.context.Z.listen(g.x2("iv-drawer-close-button", this.W), "click", this.zL, this);
            this.context.Z.listen(this.N, "touchend", () => {
                this.jH.start()
            }
            );
            this.context.Z.listen(this.N, "scroll", this.yq, this);
            this.context.N.subscribe("onHideControls", () => {
                this.LI = !0
            }
            );
            this.context.N.subscribe("onShowControls", () => {
                this.LI = !1
            }
            );
            this.context.N.subscribe("onVideoAreaChange", () => {
                this.LI = g.K0(this.Y.getRootNode(), "ytp-autohide")
            }
            );
            this.mq.push(g.GX("iv-button-shown", this.ZO, this));
            this.mq.push(g.GX("iv-button-hidden", this.Ju, this));
            In6(this)
        }
        findLastIndex(d) {
            if (this.cards.length === 0)
                return 0;
            var Q = g.te(this.cards, t => d.Z5.startMs > t.Z5.startMs || d.Z5.startMs === t.Z5.startMs && d.Z5.timestamp >= t.Z5.timestamp ? !0 : !1);
            return Q === -1 ? 0 : Q + 1
        }
        zL() {
            if (this.D) {
                $5(this.context.logger, xW(this).EK.close);
                var d = g.Xz();
                d && this.U && g.Kk(d, this.U);
                IV(this)
            }
        }
        yq() {
            g.kl(this.W, "iv-drawer-scrolled", this.N.scrollTop > 0)
        }
        ZO() {
            var d = g.Xz()
              , Q = xW(this);
            Q = Q ? Q.Xn : this.Xn;
            d && Q && g.ag(d, [Q])
        }
        Ju() {
            var d = g.Xz()
              , Q = xW(this);
            Q = Q ? Q.Xn : this.Xn;
            d && Q && g.Uv(d, [Q])
        }
        iB() {
            var d = xW(this);
            $5(this.context.logger, d.EK.s9);
            var Q = g.Xz();
            if (Q && d) {
                let t = [];
                d.oR && t.push(d.oR);
                d.Xn && t.push(d.Xn);
                t.length > 0 && g.ag(Q, t)
            }
        }
        m4() {
            var d = g.Xz()
              , Q = xW(this);
            d && Q && g.Uv(d, [Q.oR])
        }
        dW(d) {
            var Q = xW(this)
              , t = g.Xz();
            this.Z ? d ? (d = this.context.logger,
            $5(d, Q.EK.PS),
            d.Y.sendVideoStatsEngageEvent(4, void 0),
            t && Q.oR && g.Kk(t, Q.oR)) : (d = this.context.logger,
            $5(d, Q.EK.PS),
            d.Y.sendVideoStatsEngageEvent(4, void 0),
            t && Q.Xn && g.Kk(t, Q.Xn)) : (d = this.context.logger,
            $5(d, Q.EK.PS),
            d.Y.sendVideoStatsEngageEvent(4, void 0),
            t && this.Xn && g.Kk(t, this.Xn))
        }
    }
    ;
    var Ele = class extends Wmh {
        constructor(d, Q, t) {
            super(d, Q);
            this.annotation = t;
            this.isActive = !1
        }
        ZN() {
            super.ZN();
            nl2(this)
        }
        show() {
            super.show();
            var d = g.Xz()
              , Q = this.annotation.data;
            d && Q && (Q = Q.session_data) && g.ag(d, [g.se(Q.itct)])
        }
        hide() {
            super.hide();
            var d = g.Xz()
              , Q = this.annotation.data;
            d && Q && (Q = Q.session_data) && g.Uv(d, [g.se(Q.itct)])
        }
    }
    ;
    var A09 = class extends Ele {
        constructor(d, Q, t) {
            super(d, Q, t);
            this.Z = null;
            this.N = !1
        }
        show() {
            if (!this.isActive) {
                super.show();
                if (!this.N) {
                    g.A0(this.GL(), "iv-branding");
                    let d = this.annotation.data;
                    this.Z = this.createElement({
                        S: "img",
                        dj: ["branding-img", "iv-click-target"],
                        C: {
                            "aria-label": "Channel watermark",
                            src: d.image_url,
                            width: d.image_width,
                            height: d.image_height
                        }
                    });
                    g.Qf(this.Z, !1);
                    let Q = this.createElement({
                        S: "button",
                        dj: ["branding-img-container", "ytp-button"]
                    });
                    Q.appendChild(this.Z);
                    this.GL().appendChild(Q);
                    let t = this.annotation.HV();
                    t && uK(this, Q, t, this.annotation.id, d.session_data);
                    this.N = !0
                }
                g.Qf(this.GL(), !0);
                this.isActive = !0;
                if (this.Z) {
                    try {
                        eI$(this, this.Z)
                    } catch {}
                    g.A0(this.context.Y.getRootNode(), "ytp-branding-shown");
                    this.context.Y.getRootNode().style.setProperty("--branding-image-width", `${this.Z.getAttribute("width")}px`)
                }
            }
        }
        hide() {
            this.isActive && (super.hide(),
            g.Qf(this.GL(), !1),
            this.isActive = !1,
            g.Rh(this.context.Y.getRootNode(), "ytp-branding-shown"))
        }
        destroy() {
            g.Rh(this.context.Y.getRootNode(), "ytp-branding-shown");
            super.destroy()
        }
    }
    ;
    var mo6 = class {
        constructor(d, Q, t, n, e, r, f) {
            this.Z = d;
            this.D = Q;
            this.J = t;
            this.videoData = n;
            this.logger = e;
            this.Y = r;
            this.N = f
        }
    }
    ;
    var l66 = class extends Ele {
        constructor(d, Q, t) {
            super(d, Q, t);
            this.L = this.isCollapsed = this.K = !1;
            this.G = 5E3;
            this.N = this.D = this.Z = this.W = null;
            this.U = this.createElement({
                S: "div",
                dj: ["iv-promo-contents"]
            });
            this.j = new g.B$( () => {
                this.Z.setAttribute("aria-hidden", "true");
                g.Qf(this.D, !1);
                g.Qf(this.N, !0)
            }
            ,700,this);
            g.X(this, this.j)
        }
        show() {
            this.isActive || (super.show(),
            this.K || (T8O(this),
            this.K = !0),
            g.Qf(this.GL(), !0),
            g.Kn(function() {
                g.Rh(this.GL(), "iv-promo-inactive")
            }, 100, this),
            this.GL().removeAttribute("aria-hidden"),
            this.isActive = !0,
            dA(this),
            r0V(this),
            f6O(this, this.G))
        }
        hide() {
            this.isActive && (g.A0(this.GL(), "iv-promo-inactive"),
            this.isActive = !1,
            this.GL().setAttribute("aria-hidden", "true"))
        }
        rj(d, Q, t, n, e, r) {
            return this.isCollapsed ? !1 : super.rj(d, Q, t, n, e, r)
        }
        jH(d) {
            this.L = !0;
            cw(this, 500, d)
        }
        NZ() {
            this.L = !1;
            jhh(this)
        }
        mq(d) {
            d.stopPropagation();
            this.hide()
        }
        Qd(d) {
            d.stopPropagation();
            dA(this);
            this.isCollapsed = !0;
            g.A0(this.GL(), "iv-promo-collapsed-no-delay");
            this.j.start()
        }
        destroy() {
            this.j.dispose();
            super.destroy()
        }
    }
    ;
    var ui9 = class {
        constructor(d) {
            this.Y = d
        }
    }
    ;
    g.Fa("annotations_module", class extends g.Jn {
        constructor(d) {
            super(d);
            this.mq = this.Qd = !1;
            this.loadNumber = 0;
            this.G = {};
            this.logger = new ui9(this.player);
            this.j = new g.ZY(this);
            this.U = this.W = null;
            this.events = new g.ZY(this);
            this.e7 = this.L = this.Z = null;
            this.ZN = [];
            g.X(this, this.j);
            this.j.X(this.player, "onVideoAreaChange", () => {
                this.publish("onVideoAreaChange")
            }
            );
            this.j.X(this.player, "onHideControls", () => {
                this.publish("onHideControls")
            }
            );
            this.j.X(this.player, "onShowControls", () => {
                this.publish("onShowControls")
            }
            );
            this.j.X(this.player, "resize", t => {
                this.publish("resize", t)
            }
            );
            this.j.X(this.player, "presentingplayerstatechange", t => {
                this.publish("presentingplayerstatechange", t)
            }
            );
            this.subscribe("presentingplayerstatechange", this.jH, this);
            this.subscribe("resize", this.K, this);
            this.player.B().Xf.subscribe("vast_info_card_add", this.NZ, this);
            g.X(this, this.events);
            this.qZ = this.createElement({
                S: "div",
                O: "video-custom-annotations"
            });
            this.N = new g.dP({
                S: "div",
                dj: ["ytp-player-content", "ytp-iv-player-content"]
            });
            g.X(this, this.N);
            g.OG(this.player, this.N.element, 4);
            this.N.hide();
            this.D = new g.dP({
                S: "div",
                dj: ["ytp-iv-video-content"]
            });
            g.X(this, this.D);
            d = this.createElement({
                S: "div",
                O: "video-annotations"
            });
            d.appendChild(this.qZ);
            this.D.element.appendChild(d);
            this.mT() ? this.load() : this.player.V("web_fix_annotations") && (this.W = () => {
                this.loaded || this.GM() || !this.mT() || (Z0Z(this),
                this.load())
            }
            ,
            this.player.addEventListener("videodatachange", this.W));
            var Q = this.createElement({
                S: "style"
            });
            (g.IA("HEAD")[0] || document.body).appendChild(Q);
            this.addOnDisposeCallback( () => {
                g.UL(Q)
            }
            );
            if (d = Q.sheet) {
                for (let t of X$V)
                    d.insertRule(t, 0);
                for (let t of Y9h)
                    d.insertRule(t, 0)
            }
        }
        Ka(d, Q) {
            if (!B80(this.player.B().playerStyle))
                return null;
            switch (d) {
            case "loadCustomAnnotationsXml":
                return (d = g.Yx(Q)) && tq(this, d),
                !0;
            case "removeCustomAnnotationById":
                return Q && this.Z && (bK(this.Z, Q),
                U8(this.player)),
                !0
            }
            return null
        }
        getOptions() {
            return B80(this.player.B().playerStyle) ? ["loadCustomAnnotationsXml", "removeCustomAnnotationById"] : []
        }
        mT() {
            var d = this.player.getVideoData()
              , Q = d.getWatchNextResponse()?.playerOverlays?.playerOverlayRenderer;
            return d.OA || this.player.isMutedByEmbedsMutedAutoplay() ? !1 : this.player.V("web_fix_annotations") ? kMh(this) ? Q?.isWatermarkEnforced === !0 ? !0 : Q?.isAnnotationsEnabled ?? !1 : !1 : kMh(this)
        }
        K() {
            if (this.D) {
                var d = this.player.Q$().getVideoContentRect(!0);
                g.di(this.D.element, d.width, d.height);
                g.M$(this.D.element, d.left, d.top)
            }
            if (this.Z) {
                var Q = this.player.P2();
                d = this.Z;
                Q = Q.width;
                g.kl(d.W, "iv-drawer-small", Q <= 426);
                g.kl(d.W, "iv-drawer-big", Q >= 1280)
            }
        }
        jH(d) {
            i0G(this, d.state);
            d.state.Uh(2) && (this.bb() && this.uM() && this.player.getPresentingPlayerType() !== 2 && this.cN(!1),
            this.qY(!1))
        }
        load() {
            super.load();
            i0G(this, this.player.getPlayerStateObject());
            this.loadNumber++;
            var d = this.player.getVideoData();
            vlo(this, d);
            g.OG(this.player, this.D.element, 4);
            this.K();
            var Q = g.XK(d)
              , t = g.N4(d);
            if (this.player.V("web_fix_annotations")) {
                if (Q && (Q.featuredChannel && J06(this, Q.featuredChannel, Q.annotationId || "branding", d.videoId || null, d.eventId || null),
                Q = this.player.getVideoData().getWatchNextResponse()?.playerOverlays?.playerOverlayRenderer,
                Q?.isWatermarkEnforced && !Q?.isAnnotationsEnabled))
                    return;
                t && nw(this, t)
            } else
                t && nw(this, t),
                Q && Q.featuredChannel && J06(this, Q.featuredChannel, Q.annotationId || "branding", d.videoId || null, d.eventId || null);
            this.e7 = g.x2("ytp-cards-button", this.player.getRootNode());
            g.yW(d) && H0e(this, d)
        }
        onVideoDataChange() {}
        unload() {
            this.player.bV("annotations_module");
            for (let d of Object.keys(this.G))
                this.G[d].destroy();
            this.L = null;
            this.Z && (this.Z.destroy(),
            this.Z = null,
            U8(this.player));
            this.Qd = !1;
            this.U && (this.U.abort(),
            this.U = null);
            this.mq = !1;
            this.G = {};
            this.N.hide();
            super.unload();
            this.D.detach();
            Z0Z(this)
        }
        NZ(d) {
            d === this.player.getVideoData().videoId && (this.loaded ? hIH(this) : this.load())
        }
        bb() {
            return this.Z?.isAvailable() || this.mq
        }
        uM() {
            return !!this.Z && this.Z.D
        }
        cN(d, Q=!1, t) {
            this.bb();
            this.Z && (d ? t ? Mm(this.Z, t, Q) : Mm(this.Z, "YOUTUBE_DRAWER_AUTO_OPEN", Q) : IV(this.Z))
        }
        qY(d, Q) {
            this.player.publish(d ? "cardsteasershow" : "cardsteaserhide", Q)
        }
        DN() {
            this.player.B().Xf.unsubscribe("vast_info_card_add", this.NZ, this);
            g.Rh(this.player.getRootNode(), g.We.IV_DRAWER_OPEN);
            var d = this.ZN
              , Q = g.QQ;
            for (let t = 0, n = d.length; t < n; t++)
                Q.bL(d[t]);
            this.ZN.length = 0;
            super.DN()
        }
        createElement(d) {
            d = new g.dP(d);
            g.X(this, d);
            return d.element
        }
    }
    );
    g.Fa("creatorendscreen", N8z);
}
)(_yt_player);
