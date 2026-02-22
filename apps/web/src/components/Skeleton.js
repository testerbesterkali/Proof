import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Skeleton({ className = '' }) {
    return (_jsx("div", { className: `animate-pulse bg-[#112240] rounded ${className}` }));
}
export function CardSkeleton() {
    return (_jsxs("div", { className: "p-6 bg-[#020c1b] rounded-xl border border-[#112240]/50 w-full max-w-sm", children: [_jsx(Skeleton, { className: "h-4 w-1/3 mb-4" }), _jsx(Skeleton, { className: "h-6 w-3/4 mb-4" }), _jsx(Skeleton, { className: "h-4 w-full mb-2" }), _jsx(Skeleton, { className: "h-4 w-5/6 mb-6" }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Skeleton, { className: "h-8 w-24 rounded-full" }), _jsx(Skeleton, { className: "h-8 w-8 rounded-full" })] })] }));
}
