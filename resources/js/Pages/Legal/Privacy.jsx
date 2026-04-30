import { Link } from '@inertiajs/react';
import { QrCode, ArrowLeft } from 'lucide-react';

export default function Privacy() {
    return (
        <div className="min-h-[100dvh] bg-gray-50">
            {/* Nav */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                            <QrCode size={15} className="text-white" />
                        </div>
                        <span className="text-sm font-bold">MQR</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft size={15} /> Volver
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
                    <p className="text-xs text-gray-400 mb-2">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
                    <p className="text-gray-500 mb-10 text-sm">De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).</p>

                    <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-700 leading-relaxed">

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">1. Responsable del tratamiento</h2>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm">
                                <p><span className="font-medium">Titular:</span> Logan Naranjo Rodríguez</p>
                                <p><span className="font-medium">DNI:</span> 5562544J</p>
                                <p><span className="font-medium">Dirección:</span> Jesús Morante Borras</p>
                                <p><span className="font-medium">Correo electrónico:</span> contact@logannr.me</p>
                                <p><span className="font-medium">Sitio web:</span> mqr.logannr.me</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">2. Datos que recopilamos</h2>
                            <p className="mb-3">En función del uso de la plataforma, tratamos las siguientes categorías de datos:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li><span className="font-medium">Datos de registro:</span> nombre, nombre de usuario, dirección de correo electrónico y contraseña (almacenada en formato hash bcrypt).</li>
                                <li><span className="font-medium">Datos de uso:</span> QR codes creados, URLs de destino configuradas y preferencias de personalización.</li>
                                <li><span className="font-medium">Datos de escaneo:</span> dirección IP (anonimizada), país y ciudad aproximados, tipo de dispositivo, sistema operativo, navegador y fecha/hora del escaneo.</li>
                                <li><span className="font-medium">Datos técnicos:</span> cookies de sesión necesarias para el funcionamiento del servicio.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">3. Finalidad y base jurídica del tratamiento</h2>
                            <div className="space-y-3">
                                {[
                                    { fin: 'Prestación del servicio', base: 'Ejecución de contrato (art. 6.1.b RGPD)' },
                                    { fin: 'Estadísticas de escaneos', base: 'Interés legítimo del responsable (art. 6.1.f RGPD)' },
                                    { fin: 'Comunicaciones de servicio', base: 'Ejecución de contrato (art. 6.1.b RGPD)' },
                                    { fin: 'Cumplimiento de obligaciones legales', base: 'Obligación legal (art. 6.1.c RGPD)' },
                                ].map(({ fin, base }) => (
                                    <div key={fin} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 bg-gray-50 rounded-xl p-3">
                                        <span className="font-medium text-gray-800 sm:w-48 flex-shrink-0">{fin}</span>
                                        <span className="text-gray-500">{base}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">4. Plazo de conservación</h2>
                            <p>Los datos se conservarán mientras la cuenta permanezca activa. Tras la cancelación de la cuenta, los datos se eliminarán en un plazo máximo de <strong>30 días</strong>, salvo obligación legal de conservación. Los datos de escaneo anonimizados podrán conservarse con fines estadísticos agregados.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">5. Destinatarios de los datos</h2>
                            <p className="mb-3">No se ceden datos a terceros salvo obligación legal. No obstante, para la prestación del servicio contamos con los siguientes encargados de tratamiento:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li><span className="font-medium">Supabase Inc.</span> — proveedor de base de datos (PostgreSQL en la nube). Servidores en la UE (AWS eu-west-1).</li>
                                <li><span className="font-medium">Strato</span> — alojamiento de la aplicación. Alemania.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">6. Derechos del interesado</h2>
                            <p className="mb-3">Puede ejercer los siguientes derechos escribiendo a <strong>contact@logannr.me</strong>, adjuntando copia de su DNI u otro documento identificativo:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {['Acceso', 'Rectificación', 'Supresión', 'Oposición', 'Limitación', 'Portabilidad'].map(d => (
                                    <div key={d} className="bg-gray-50 rounded-xl px-3 py-2 text-sm font-medium text-gray-700">{d}</div>
                                ))}
                            </div>
                            <p className="mt-3">Asimismo, tiene derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos</strong> (www.aepd.es).</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">7. Cookies</h2>
                            <p>Utilizamos exclusivamente cookies técnicas y de sesión, necesarias para el funcionamiento del servicio. No utilizamos cookies de seguimiento ni publicitarias. Para más información, consulte nuestra <Link href="/legal" className="text-black underline underline-offset-2">Política de Cookies</Link>.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">8. Seguridad</h2>
                            <p>Aplicamos medidas técnicas y organizativas adecuadas para garantizar la seguridad de los datos: cifrado HTTPS/TLS, hash bcrypt para contraseñas, rate limiting en APIs y separación de entornos de producción y desarrollo.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">9. Cambios en esta política</h2>
                            <p>Nos reservamos el derecho a actualizar esta política. En caso de cambios sustanciales, notificaremos a los usuarios por correo electrónico con al menos 15 días de antelación.</p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white mt-8">
            <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} MQR — Logan Naranjo Rodríguez</p>
                <div className="flex gap-4 text-xs text-gray-400">
                    <Link href="/privacy" className="hover:text-black transition-colors">Privacidad</Link>
                    <Link href="/legal" className="hover:text-black transition-colors">Aviso legal</Link>
                    <Link href="/terms" className="hover:text-black transition-colors">Términos</Link>
                </div>
            </div>
        </footer>
    );
}
