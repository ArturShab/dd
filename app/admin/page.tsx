import Link from 'next/link'
import prisma from '@/lib/prisma'

export default async function AdminPage() {
	const requests = await prisma.request.findMany({ orderBy: { id: 'desc' } })

	return (
		<main className="px-[6%] py-8">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Админ — Заявки</h1>
				<Link href="/">На сайт</Link>
			</div>

			{requests.length === 0 ? (
				<div className="text-gray-600">Заявок пока нет.</div>
			) : (
				<div className="overflow-x-auto bg-white border rounded">
					<table className="w-full text-sm table-auto">
						<thead className="bg-gray-100">
							<tr>
								<th className="p-2 text-left">ID</th>
								<th className="p-2 text-left">Телефон</th>
								<th className="p-2 text-left">Организация</th>
								<th className="p-2 text-left">Адрес</th>
								<th className="p-2 text-left">Итого</th>
								<th className="p-2 text-left">Список</th>
							</tr>
						</thead>
						<tbody>
							{requests.map((r) => (
								<tr key={r.id} className="border-t">
									<td className="p-2 align-top font-mono">{r.id}</td>
									<td className="p-2 align-top">{r.phone}</td>
									<td className="p-2 align-top">{r.organization || '—'}</td>
									<td className="p-2 align-top">{r.address || '—'}</td>
									<td className="p-2 align-top">{r.total} руб.</td>
									<td className="p-2 align-top whitespace-pre-wrap max-w-xl">
										{(() => {
											const raw = r.list || '';
											let items: any[] | null = null;
											let commentText: string | null = null;
											try {
												const parsed = JSON.parse(raw);
												if (Array.isArray(parsed)) items = parsed;
											} catch (e) {
												const lastBracket = raw.lastIndexOf(']');
												if (lastBracket !== -1) {
													const maybeJson = raw.slice(0, lastBracket + 1);
													const rest = raw.slice(lastBracket + 1).trim();
													try {
														const parsed = JSON.parse(maybeJson);
														if (Array.isArray(parsed)) {
															items = parsed;
															const marker = 'Комментарий:';
															const idx = rest.indexOf(marker);
															if (idx !== -1) {
																commentText = rest.slice(idx + marker.length).trim();
															} else if (rest.length) {
																commentText = rest;
															}
														}
													} catch (err) {
														// ignore
													}
												}
											}

											if (items && Array.isArray(items)) {
												return (
													<div>
														<ul className="space-y-1">
															{items.map((it: any) => (
																<li key={it.id} className="text-sm flex items-center justify-between">
																	<div>
																		<Link href={`/product/${it.id}`} className="text-blue-600 underline">{it.name || `#${it.id}`}</Link>
																		{' — '}
																		{it.quantity || 1} шт. × {it.price || 0} руб.
																	</div>
																</li>
															))}
														</ul>
														{commentText && (
															<div className="mt-2 text-sm text-gray-700">
																<strong>Комментарий:</strong>
																<div className="whitespace-pre-wrap">{commentText}</div>
															</div>
														)}
													</div>
												)
											}

											return raw || '—';
										})()}
									</td>
									<td className="p-2 align-top">
										<form action="/admin/delete" method="post">
											<input type="hidden" name="id" value={r.id} />
											<button type="submit" className="text-sm text-red-600">Удалить</button>
										</form>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</main>
	)
}

