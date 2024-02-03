import { ContentCategory } from '@/lib/types'
import { Link } from '@remix-run/react'

const categories = [
  ContentCategory.TV,
  ContentCategory.ANIME,
  ContentCategory.MOVIES
]

export default function Index() {
  return (
    <div className="p-4 my-4 mx-auto max-w-screen-md">
      <h1 className="text-2xl mb-8 text-center">Palomitas Multi Torrent API</h1>
      <div className="space-y-4">
        <p>
          PalomitasMT es una API agregadora de torrents y metadatos sobre los mismos.
          Hay varios tipos de b&uacute;squedas disponibles que se dividen en <strong>cateogr&iacute;as</strong>, y todos los procesos de b&uacute;squeda est&aacute;n separados por esas categor&iacute;as.
        </p>
        <p>
          Cada categor&iacute;a tiene una forma distinta de agrupar los resultados de b&uacute;squeda (por calidad, por episodio y/o por serie) a los que se añade la informacion de la serie o pel&iacute;cula en concreto.
        </p>
        <p>
          Las categor&iacute;as disponibles son: {categories.map((c, i) => <strong key={c}>{i === 0 ? '' : ', '}{c}</strong>)}
        </p>
        <p>
          Para cada categor&iacute;a tenemos un endpoint que realiza su proceso de b&uacute;squeda particular.
          Estos endpoints son:
        </p>
        <ul className="list-disc ml-4 space-y-2 pb-4">
          {categories.map((c => (
            <li key={c}>
              <strong>
                <Link to={`/api/${c}`} className="text-blue-500 hover:underline">
                  /api/{c}
                </Link>
              </strong>
            </li>
          )))}
        </ul>
        <p>
          Cada uno de estos endpoints puede recibir por query params los siguientes par&aacute;metros
        </p>
        <ul className="list-disc ml-4 space-y-2 pb-4">
          <li><strong>rpp</strong> (numero de resultados por pagina, por defecto 20)</li>
          <li><strong>page</strong> (pagina actual, por defecto 1)</li>
          <li><strong>q</strong> (texto para buscar)</li>
          <li><strong>nogroup</strong> (si se detecta este par&aacute;metro, se enviar&aacute;n los resultados de b&uacute;squeda planos, sin procesar)</li>
          <li><strong>nometa</strong> (si se detecta este par&aacute;metro, se enviar&aacute;n los resultados de b&uacute;squeda procesados, y agrupados por capitulos pero sin añadir metadatos de la serie o pel&iacute;cula)</li>
          <li><strong>tp</strong> (este par&aacute;metro puede cambiar el proveedor de torrents que usa una categor&iacute;a)</li>
        </ul>
        <h2 className="text-xl">Proveedores</h2>
        <p>Una lista con los proveedores de torrents disponibles y su relaci&oacute;n con las categor&iacute;as puede ser consultada en el endpoint <Link to='/api/torrent_providers' className="text-blue-500 hover:underline"><strong>/api/torrent_providers</strong></Link>.</p>
        <p>Cada <strong>categor&iacute;a</strong> tiene asignado un conjunto de <strong>proveedores de torrents</strong> y un <strong>proveedor de metadatos</strong>. La relaci&oacute;n entre categor&iacute;as y proveedores de metadatos es cerrada y no puede ser alterada pero la relacion entre una categoria y el proveedor de torrents que utiliza puede ser seleccionada usando el par&aacute;metro <strong>tp</strong> en los query param del endpoint de esa categoria. Si este parametro recibe el <strong>id</strong> de un provider valido y ese provider encaja con la categor&iacute;a seleccionada, esta categor&iacute;a usara este provider para obtener sus datos</p>
      </div>
    </div>
  )
}

