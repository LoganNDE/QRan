import { Link } from '@inertiajs/react';
import { QrCode, ArrowLeft } from 'lucide-react';

export default function Terms() {
    return (
        <div className="min-h-[100dvh] bg-gray-50">
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
                    <p className="text-gray-500 mb-10 text-sm">Por favor, lee atentamente estos términos antes de usar MQR. Al registrarte o usar el servicio, aceptas quedar vinculado por estas condiciones.</p>

                    <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">1. Descripción del servicio</h2>
                            <p>MQR es una plataforma de generación y gestión de <strong>códigos QR dinámicos</strong> que permite a los usuarios crear QR codes cuyo destino puede modificarse en cualquier momento sin necesidad de regenerar o reimprimir el código. El servicio incluye estadísticas de escaneos, personalización visual del QR y gestión de cuenta.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">2. Registro y cuenta de usuario</h2>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Para acceder al servicio es necesario crear una cuenta con datos verídicos y actualizados.</li>
                                <li>El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.</li>
                                <li>Cada persona física solo puede tener una cuenta activa.</li>
                                <li>El titular se reserva el derecho a suspender o cancelar cuentas que incumplan estas condiciones.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">3. Plan gratuito y limitaciones</h2>
                            <p className="mb-2">El plan gratuito incluye:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Hasta <strong>5 QR codes</strong> activos simultáneamente.</li>
                                <li>Estadísticas básicas de escaneo (últimos 30 días).</li>
                                <li>Personalización visual completa.</li>
                                <li>Descarga en PNG y SVG.</li>
                            </ul>
                            <p className="mt-3">El titular se reserva el derecho a modificar los límites del plan gratuito con un preaviso de <strong>15 días</strong>.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">4. Uso aceptable</h2>
                            <p className="mb-2">El usuario se compromete a no utilizar MQR para:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Redirigir a contenido ilegal, fraudulento, difamatorio o que vulnere derechos de terceros.</li>
                                <li>Distribuir malware, ransomware, phishing u otro software malicioso.</li>
                                <li>Realizar campañas de spam o comunicaciones comerciales no solicitadas.</li>
                                <li>Realizar ataques de denegación de servicio (DoS/DDoS) contra la plataforma.</li>
                                <li>Extraer datos de la plataforma mediante scraping no autorizado.</li>
                                <li>Cualquier actividad que infrinja la legislación vigente.</li>
                            </ul>
                            <p className="mt-3">El incumplimiento de estas normas puede conllevar la suspensión inmediata de la cuenta sin derecho a reembolso.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">5. Disponibilidad del servicio</h2>
                            <p>MQR se presta «tal cual» y «según disponibilidad». El titular no garantiza una disponibilidad del 100% y podrá interrumpir el servicio por mantenimiento, actualizaciones o causas de fuerza mayor. Se intentará notificar las interrupciones planificadas con antelación razonable.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">6. Contenido del usuario</h2>
                            <p>Los QR codes, URLs de destino y configuraciones creados por el usuario son de su exclusiva responsabilidad. El usuario garantiza que dispone de todos los derechos necesarios sobre las URLs y contenidos enlazados. MQR actúa como mero intermediario técnico y no supervisa el contenido de los destinos enlazados.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">7. Cancelación y eliminación de cuenta</h2>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>El usuario puede cancelar su cuenta en cualquier momento desde su perfil.</li>
                                <li>Tras la cancelación, todos los QR codes quedarán desactivados y los datos se eliminarán en un plazo máximo de 30 días.</li>
                                <li>El titular podrá cancelar cuentas que incumplan estas condiciones sin previo aviso.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">8. Limitación de responsabilidad</h2>
                            <p>En la máxima medida permitida por la ley aplicable, MQR no será responsable de daños indirectos, incidentales, especiales o consecuentes derivados del uso o imposibilidad de uso del servicio. La responsabilidad total máxima frente a un usuario no superará el importe abonado por el servicio en los últimos 3 meses o <strong>50 €</strong>, lo que sea mayor.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">9. Modificaciones de los términos</h2>
                            <p>El titular podrá modificar estos términos en cualquier momento. Los cambios sustanciales se comunicarán por correo electrónico con al menos <strong>15 días</strong> de antelación. El uso continuado del servicio tras dicho período se considerará aceptación de los nuevos términos.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">10. Ley aplicable y resolución de conflictos</h2>
                            <p>Estos términos se rigen por la legislación española. Antes de acudir a la vía judicial, las partes se comprometen a intentar resolver cualquier controversia de forma amistosa. Para reclamaciones en línea, la Comisión Europea pone a disposición la plataforma ODR: <strong>ec.europa.eu/consumers/odr</strong>.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">11. Contacto</h2>
                            <p>Para cualquier consulta relacionada con estos términos, puedes contactar con nosotros en: <strong>contact@logannr.me</strong></p>
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
