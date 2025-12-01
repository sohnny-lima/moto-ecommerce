"use client";

import Link from "next/link";

export default function CheckoutFailurePage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl border border-red-500/40 p-6 text-center space-y-4 shadow-lg">
                <h1 className="text-2xl font-semibold text-red-600">
                    El pago no se completó 😕
                </h1>
                <p className="text-sm text-gray-600">
                    Tu pago fue rechazado o cancelado. Puedes intentar nuevamente o elegir
                    otro medio de pago.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link
                        href="/checkout"
                        className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-sm font-medium text-white transition-colors"
                    >
                        Intentar de nuevo
                    </Link>
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        </main>
    );
}
