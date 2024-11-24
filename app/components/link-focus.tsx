"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react";
export default function LinkFocus({href, children,className}:{href:string, children:ReactNode, className?:string}) {
    const path = usePathname();
    return(
        <Link className={`${href==path? " border-b-2 border-b-cyber-green text-cyber-green":""} hover:text-cyber-green ${className}`} href={href} prefetch>{children}</Link>
    )
}