import { Link } from '@inertiajs/react';
import { QrCode, ArrowLeft } from 'lucide-react';

export default function LegalNotice() {
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Aviso Legal</h1>
                    <p className="text-gray-500 mb-10 text-sm">En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE).</p>

                    <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">1. Datos identificativos del titular</h2>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                                <p><span className="font-medium">Titular:</span> Logan Naranjo Rodríguez</p>
                                <p><span className="font-medium">DNI:</span> 5562544J</p>
                                <p><span className="font-medium">Domicilio:</span> Jesús Morante Borras</p>
                                <p><span className="font-medium">Correo electrónico:</span> contact@logannr.me</p>
                                <p><span className="font-medium">Sitio web:</span> mqr.logannr.me</p>
                                <p><span className="font-medium">Denominación del servicio:</span> MQR</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">2. Objeto</h2>
                            <p>El presente Aviso Legal regula el acceso y uso del sitio web <strong>mqr.logannr.me</strong> (en adelante, «el Sitio»), titularidad de Logan Naranjo Rodríguez. El acceso al Sitio implica la aceptación plena y sin reservas de las presentes condiciones.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">3. Propiedad intelectual e industrial</h2>
                            <p>Todos los contenidos del Sitio — incluyendo, sin carácter limitativo, textos, imágenes, logotipos, código fuente, diseños y la marca <strong>MQR</strong> — son titularidad exclusiva de Logan Naranjo Rodríguez o de terceros que han autorizado su uso.</p>
                            <p className="mt-2">Queda prohibida la reproducción, distribución, comunicación pública o transformación de dichos contenidos sin autorización expresa y por escrito del titular.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">4. Condiciones de uso</h2>
                            <p className="mb-2">El usuario se compromete a hacer uso del Sitio y sus servicios de conformidad con la ley, las presentes condiciones y las buenas costumbres. En particular, queda expresamente prohibido:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Usar el servicio para difundir contenido ilegal, fraudulento o contrario al orden público.</li>
                                <li>Crear QR codes que redirijan a sitios de phishing, malware u otras actividades maliciosas.</li>
                                <li>Intentar vulnerar la seguridad o integridad del servicio.</li>
                                <li>Usar el servicio para enviar comunicaciones comerciales no solicitadas (spam).</li>
                                <li>Suplantar la identidad de otras personas o entidades.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">5. Responsabilidad</h2>
                            <p className="mb-2">Logan Naranjo Rodríguez no será responsable de:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>El contenido de los sitios web a los que redirijan los QR codes creados por los usuarios.</li>
                                <li>Los daños derivados de un uso incorrecto o contrario a las condiciones del servicio.</li>
                                <li>Interrupciones del servicio debidas a causas de fuerza mayor o a terceros.</li>
                                <li>Posibles errores o inexactitudes en los contenidos del Sitio.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">6. Ley aplicable y jurisdicción</h2>
                            <p>Las presentes condiciones se rigen por la legislación española. Para cualquier controversia derivada del acceso o uso del Sitio, las partes se someten a los Juzgados y Tribunales de <strong>Valencia</strong>, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">7. Política de cookies</h2>
                            <p>Este sitio web utiliza exclusivamente <strong>cookies técnicas</strong> esenciales para el funcionamiento del servicio (gestión de sesión de usuario). No se utilizan cookies de rastreo, analítica de terceros ni publicidad comportamental. Puede eliminar las cookies desde la configuración de su navegador.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">8. Modificaciones</h2>
                            <p>El titular se reserva el derecho a modificar el presente Aviso Legal en cualquier momento. Las modificaciones serán efectivas desde su publicación en el Sitio.</p>
                        </section>

                        <section>
                            <h2 className="text-base font-semibold text-gray-900 mb-3">9. Créditos de software de código abierto</h2>
                            <p className="mb-3">MQR se ha desarrollado haciendo uso de los siguientes proyectos de código abierto, distribuidos bajo sus respectivas licencias:</p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-2 pr-4 font-semibold text-gray-700">Proyecto</th>
                                            <th className="text-left py-2 pr-4 font-semibold text-gray-700">Licencia</th>
                                            <th className="text-left py-2 font-semibold text-gray-700">Uso</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        {[
                                            { name: 'Laravel', license: 'MIT', use: 'Framework backend PHP' },
                                            { name: 'React', license: 'MIT', use: 'Interfaz de usuario' },
                                            { name: 'Inertia.js', license: 'MIT', use: 'Puente servidor–cliente' },
                                            { name: 'Vite', license: 'MIT', use: 'Empaquetado y compilación frontend' },
                                            { name: 'Tailwind CSS', license: 'MIT', use: 'Estilos y diseño visual' },
                                            { name: 'qr-code-styling', license: 'MIT', use: 'Generación y personalización de QR codes' },
                                            { name: 'Recharts', license: 'MIT', use: 'Gráficas de estadísticas' },
                                            { name: 'Lucide React', license: 'ISC', use: 'Iconografía de la interfaz' },
                                            { name: 'react-hot-toast', license: 'MIT', use: 'Notificaciones de usuario' },
                                            { name: 'Headless UI', license: 'MIT', use: 'Componentes UI accesibles' },
                                            { name: 'Axios', license: 'MIT', use: 'Cliente HTTP' },
                                            { name: 'Zustand', license: 'MIT', use: 'Gestión de estado global' },
                                            { name: 'Laravel Sanctum', license: 'MIT', use: 'Autenticación y gestión de sesiones' },
                                            { name: 'Ziggy', license: 'MIT', use: 'Rutas Laravel en JavaScript' },
                                            { name: 'Doctrine DBAL', license: 'MIT/LGPL', use: 'Capa de abstracción de base de datos' },
                                        ].map(({ name, license, use }) => (
                                            <tr key={name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-2 pr-4 font-medium text-gray-800">{name}</td>
                                                <td className="py-2 pr-4">
                                                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{license}</span>
                                                </td>
                                                <td className="py-2 text-gray-500">{use}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-3 text-gray-500">Los textos completos de cada licencia están disponibles en los repositorios oficiales de cada proyecto. MQR no reclama ningún derecho sobre dichos proyectos y los utiliza de conformidad con sus condiciones de distribución.</p>
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
