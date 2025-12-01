"use client";

import Link from "next/link";

export default function CheckoutSuccessPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl border border-emerald-500/40 p-6 text-center space-y-4 shadow-lg">
                <h1 className="text-2xl font-semibold text-emerald-600">
                    ¡Pago realizado con éxito! 🎉
                </h1>
                <p className="text-sm text-gray-600">
                    Hemos recibido tu pago correctamente. En unos momentos procesaremos tu
                    pedido y te enviaremos los detalles a tu correo.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-medium text-white transition-colors"
                >
                    Volver a la tienda
                </Link>
            </div>
        </main>
    );
}
