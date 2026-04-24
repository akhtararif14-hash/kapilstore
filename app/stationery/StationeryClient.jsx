function StationeryCard({ product }) {
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? 0 : null);
  const [imgIdx, setImgIdx] = useState(0);
  const [optionsOpen, setOptionsOpen] = useState(false); // ← new

  const price = hasVariants
    ? Number(product.variants[selectedVariant]?.price || 0)
    : Number(product.price || 0);

  const mrp = hasVariants
    ? Number(product.variants[selectedVariant]?.mrp || 0)
    : Number(product.actualPrice || 0);

  const hasDiscount = mrp > price;
  const discountPct = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];

  const cartProduct = hasVariants
    ? {
        ...product,
        price,
        actualPrice: mrp,
        title: `${product.title} – ${product.variants[selectedVariant]?.label}`,
      }
    : product;

  return (
    <div className="bg-[#1a2830] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-400/30 transition-all group flex flex-col">

      {/* ── Image ── */}
      <div className="relative aspect-square overflow-hidden bg-[#22323c]">
        {hasDiscount && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">
            {discountPct}% OFF
          </span>
        )}
        <img
          src={images[imgIdx]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition ${
                  i === imgIdx ? "bg-blue-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-3 flex flex-col flex-1">

        {/* Title */}
        <p className="text-sm font-black text-white line-clamp-2 mb-1">
          {product.title}
        </p>
        {product.unit && (
          <p className="text-xs text-slate-500 mb-2">{product.unit}</p>
        )}

        {/* ── Collapsible Options ── */}
        {hasVariants && (
          <div className="mb-2">
            {/* Toggle button */}
            <button
              type="button"
              onClick={() => setOptionsOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                optionsOpen
                  ? "border-blue-400 bg-blue-500/15 text-blue-300"
                  : "border-white/15 bg-[#22323c] text-slate-400 hover:border-blue-400/40 hover:text-blue-300"
              }`}
            >
              options
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${optionsOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Expandable variant chips */}
            {optionsOpen && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.variants.map((v, i) => {
                  const isSelected = selectedVariant === i;
                  const vMrp = Number(v.mrp || 0);
                  const vPrice = Number(v.price || 0);
                  const vDiscount =
                    vMrp > vPrice
                      ? Math.round(((vMrp - vPrice) / vMrp) * 100)
                      : 0;

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(i)}
                      className={`relative flex flex-col items-start px-2.5 py-2 rounded-xl border text-left transition-all min-w-[64px] ${
                        isSelected
                          ? "border-blue-400 bg-blue-500/15 ring-1 ring-blue-400/40"
                          : "border-white/10 bg-[#22323c] hover:border-blue-400/40"
                      }`}
                    >
                      <span
                        className={`text-xs font-black leading-tight ${
                          isSelected ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {v.label}
                      </span>
                      <span
                        className={`text-[11px] font-black mt-0.5 ${
                          isSelected ? "text-blue-400" : "text-slate-400"
                        }`}
                      >
                        ₹{vPrice}
                      </span>
                      {vMrp > vPrice && (
                        <span className="text-[10px] text-slate-600 line-through leading-none">
                          ₹{vMrp}
                        </span>
                      )}
                      {vDiscount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full leading-none">
                          -{vDiscount}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Price display ── */}
        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-lg font-black text-blue-400">₹{price}</span>
          {hasDiscount && (
            <>
              <span className="text-xs text-slate-500 line-through">₹{mrp}</span>
              <span className="text-xs text-red-400 font-bold">{discountPct}% off</span>
            </>
          )}
        </div>

        {/* Selected variant label */}
        {hasVariants && product.variants[selectedVariant]?.label && (
          <p className="text-[10px] text-slate-500 -mt-2 mb-3">
            Selected:{" "}
            <span className="text-blue-300 font-bold">
              {product.variants[selectedVariant].label}
            </span>
          </p>
        )}

        <AddToCartButton product={cartProduct} className="w-full text-xs py-2 rounded-xl" />
      </div>
    </div>
  );
}