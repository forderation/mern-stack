(this["webpackJsonpmy-location"]=this["webpackJsonpmy-location"]||[]).push([[9],{34:function(e,t,a){"use strict";var n=a(0),c=a.n(n);a(40);t.a=function(e){return c.a.createElement("div",{className:"card ".concat(e.className),style:e.style},e.children)}},40:function(e,t,a){},64:function(e,t,a){},65:function(e,t,a){},66:function(e,t,a){},74:function(e,t,a){"use strict";a.r(t);var n=a(38),c=a.n(n),r=a(39),l=a(8),o=a(0),s=a.n(o),i=a(1),m=a(34),u=a(33),p=a(52),d=(a(64),function(e){var t=Object(o.useRef)(),a=e.zoom,n=e.center;return Object(o.useEffect)((function(){var c=new window.google.maps.Map(t.current,{center:n,zoom:a});new window.google.maps.Marker({position:e.center,map:c})}),[n,a]),s.a.createElement("div",{ref:t,className:"map ".concat(e.className),style:e.tyle})}),E=(a(65),a(15)),f=a(42),h=a(41),v=a(13),b=function(e){var t=s.a.useState(!1),a=Object(l.a)(t,2),n=a[0],b=a[1],g=Object(f.a)(),k=g.loadingState,O=g.error,_=g.sendRequest,w=g.clearError,C=(Object(i.g)(),Object(o.useContext)(E.a)),j=s.a.useState(!1),N=Object(l.a)(j,2),y=N[0],x=N[1],D=function(){return b((function(e){return!e}))},S=function(){return x((function(e){return!e}))},I=function(){var t=Object(r.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return S(),t.prev=1,t.next=4,_("".concat("https://forderation-maps-backend.herokuapp.com/api","/places/").concat(e.id),"DELETE",null,{Authorization:"Bearer "+C.token});case 4:e.deletePlace(e.id),t.next=9;break;case 7:t.prev=7,t.t0=t.catch(1);case 9:case"end":return t.stop()}}),t,null,[[1,7]])})));return function(){return t.apply(this,arguments)}}();return s.a.createElement(s.a.Fragment,null,s.a.createElement(h.a,{error:O,onClear:w}),k&&s.a.createElement(v.a,{asOverlay:!0}),s.a.createElement(p.a,{show:n,onClick:D,header:e.address,contentClass:"place-item___modal-content",footerClass:"place-item__modal-actions",footer:s.a.createElement(u.a,{onClick:D},"CLOSE")},s.a.createElement("div",{className:"map-container"},s.a.createElement(d,{center:e.coordinates,zoom:16}))),s.a.createElement(p.a,{show:y,onClick:S,header:"Are you sure ?",contentClass:"place-item___modal-content",footerClass:"place-item__modal-actions",footer:s.a.createElement(s.a.Fragment,null,s.a.createElement(u.a,{inverse:!0,onClick:S},"Cancel"),!k&&s.a.createElement(u.a,{danger:!0,onClick:I},"Delete"))},s.a.createElement("p",null,"Do you want to proceed and delete this place? please note that it can't be undone thereafter.")),s.a.createElement("li",{className:"place-item"},s.a.createElement(m.a,{className:"place-item__content"},s.a.createElement("div",{className:"place-item__image"},s.a.createElement("img",{src:"".concat("https://forderation-maps-backend.herokuapp.com","/").concat(e.image),alt:e.title})),s.a.createElement("div",{className:"place-item__info"},s.a.createElement("h2",null,e.title),s.a.createElement("h3",null,e.address),s.a.createElement("p",null,e.description)),s.a.createElement("div",{className:"place-item__actions"},s.a.createElement(u.a,{inverse:!0,onClick:D},"VIEW ON MAP"),C.isLoggedIn&&C.userId==e.creator&&s.a.createElement(s.a.Fragment,null,s.a.createElement(u.a,{to:"/place/".concat(e.id)},"EDIT"),s.a.createElement(u.a,{danger:!0,onClick:S},"DELETE")," ")))))},g=(a(66),function(e){return 0===e.items.length?s.a.createElement("div",{className:"place-list center"},s.a.createElement(m.a,null,s.a.createElement("h2",null,"No places found. Maybe create one ?"),s.a.createElement(u.a,{to:"/places/new"},"Share Place"))):s.a.createElement("ul",{className:"place-list"},e.items.map((function(t){return s.a.createElement(b,{key:t.id,id:t.id,image:t.image,description:t.description,title:t.title,address:t.address,creator:t.creator,coordinates:t.location,deletePlace:e.onDelete})})))});t.default=function(){var e=Object(f.a)(),t=e.isLoading,a=e.error,n=e.sendRequest,m=e.clearError,u=Object(i.h)().userId,p=Object(i.g)(),d=Object(o.useState)(),E=Object(l.a)(d,2),b=E[0],k=E[1];Object(o.useEffect)((function(){(function(){var e=Object(r.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,n("".concat("https://forderation-maps-backend.herokuapp.com/api","/places/user/").concat(u));case 3:t=e.sent,k(t.places),console.log(t.places),e.next=10;break;case 8:e.prev=8,e.t0=e.catch(0);case 10:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(){return e.apply(this,arguments)}})()()}),[n,u]);return s.a.createElement(s.a.Fragment,null,!b&&s.a.createElement("div",{className:"center"},s.a.createElement(v.a,{asOverlay:!0})),s.a.createElement(h.a,{error:a,onClear:function(){m(),p.push("/")}}),!t&&b&&s.a.createElement(g,{items:b,onDelete:function(e){k((function(t){return t.filter((function(t){return t.id!==e}))}))}}))}}}]);
//# sourceMappingURL=9.7ca48424.chunk.js.map