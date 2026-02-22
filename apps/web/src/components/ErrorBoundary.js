import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    state = {
        hasError: false
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback || (_jsxs("div", { className: "flex flex-col items-center justify-center p-8 text-center h-full min-h-[400px]", children: [_jsx("h2", { className: "text-2xl font-heading font-semibold text-red-500 mb-4", children: "Something went wrong" }), _jsx("p", { className: "text-cloud/70 mb-6", children: "We're sorry, but an unexpected error occurred." }), _jsx("button", { className: "px-4 py-2 bg-electric text-navy font-semibold rounded hover:bg-electric/90 transition-colors", onClick: () => this.setState({ hasError: false }), children: "Try again" })] }));
        }
        return this.props.children;
    }
}
