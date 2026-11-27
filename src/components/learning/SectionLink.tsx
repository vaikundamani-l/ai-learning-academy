import type {AnchorHTMLAttributes} from 'react';
import {Link,useLocation} from 'react-router-dom';

interface SectionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>,'href'>{sectionId:string;}
/** Preserve HashRouter's lesson route while linking to a section inside it. */
export function SectionLink({sectionId,...props}:SectionLinkProps){
 const {pathname,search}=useLocation();
 return <Link {...props} to={{pathname,search,hash:`#${encodeURIComponent(sectionId)}`}} preventScrollReset/>;
}
