"use client";

import Link from "next/link";

export default function CheckoutPendingPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl border border-amber-500/40 p-6 text-center space-y-4 shadow-lg">
                <h1 className="text-2xl font-semibold text-amber-600">
                    Pago en proceso ⏳
                </h1>
                <p className="text-sm text-gray-600">
                    Tu pago está siendo procesado por MercadoPago. Te notificaremos cuando
                    se confirme el resultado.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-sm font-medium text-white transition-colors"
                >
                    Volver a la tienda
                </Link>
            </div>
        </main>
    );
}
