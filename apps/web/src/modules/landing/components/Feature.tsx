'use client';

export default function Feature() {
  const cards = [
    {
      image:
        'https://i.pinimg.com/originals/af/7d/5c/af7d5c0f37153e44a27a34879b2d98db.gif',
      title: 'Zero infrastructure needed.',
      description:
        'A fully managed job scheduler. No servers to provision, no daemon processes to maintain.',
    },
    {
      image:
        'https://i.pinimg.com/originals/03/16/7b/03167b386a144c804490935b3906cbbb.gif',
      title: 'Real-time execution logs.',
      description:
        'Monitor every scheduled run, view console outputs, and debug failures instantly from the dashboard.',
    },
    {
      image:
        'https://i.pinimg.com/originals/80/72/20/8072208f034d8042ef4aa5065d46928b.gif',
      title: 'Flexible API triggers.',
      description:
        'Trigger jobs manually, pass dynamic payloads, or update cron expressions on the fly using our API.',
    },
  ];

  return (
    <section className="bg-transparent ">
      <div className="px-4 sm:px-6 md:px-6 mt-30">
        <div className="mt-10 sm:mt-14 md:mt-20 grid grid-cols-1 border border-zinc-200 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex min-h-[400px] md:min-h-[620px] flex-col border-b md:border-b-0 md:border-r border-zinc-200 last:border-b-0 last:border-r-0"
            >
              <div className="relative flex-1 border-b border-zinc-200 flex items-center justify-center p-6">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-40 sm:w-52 md:w-70 object-contain"
                />
              </div>
              <div className="p-5 sm:p-6 md:p-8">
                <h3 className="text-lg md:text-xl text-black -tracking-[1px]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm md:text-lg leading-relaxed text-black/70 -tracking-[0.75px]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
