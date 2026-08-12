import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productsApi } from '../api';
import { Search, RotateCcw, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Catalog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract params from URL for reload stability
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Local inputs
  const [searchInput, setSearchInput] = useState(searchParam);

  const limit = 12;
  const skip = (pageParam - 1) * limit;

  // Sync input field with URL search query
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productsApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when search criteria or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.getProducts({
          category: categoryParam,
          search: searchParam,
          limit,
          skip
        });
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
      } catch (err) {
        setError(err.message || 'Failed to fetch catalog wares.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam, pageParam, skip]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      search: searchInput,
      category: categoryParam, // retain category
      page: '1' // reset page
    });
  };

  const handleCategorySelect = (categorySlug) => {
    setSearchParams({
      search: searchParam,
      category: categorySlug,
      page: '1'
    });
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      search: searchParam,
      category: categoryParam,
      page: newPage.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Catalog Filters */}
      <aside className="w-full lg:w-64 flex-shrink-0 bg-paperWhite border-2 border-ledgerInk p-6 shadow-vintage rounded-sm">
        <h2 className="text-xl font-bold font-display border-b border-ledgerInk pb-2 mb-4 flex items-center justify-between">
          <span>CATALOG INDEX</span>
          <Filter className="w-4 h-4" />
        </h2>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <label htmlFor="catalog-search" className="block text-xs font-ledger font-bold mb-1">SEARCH WARES</label>
          <div className="relative">
            <input
              id="catalog-search"
              type="text"
              className="w-full bg-paperWhite-light border border-ledgerInk px-3 py-2 text-sm font-ledger pr-10 focus:outline-none focus:ring-1 focus:ring-vintageRed"
              placeholder="e.g. soap, phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 text-ledgerInk hover:text-vintageRed" aria-label="Search button">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Category List */}
        <div className="mb-6">
          <span className="block text-xs font-ledger font-bold border-b border-ledgerInk/20 pb-1 mb-2">CATEGORIES</span>
          <ul className="space-y-1 text-sm font-ledger max-h-64 lg:max-h-none overflow-y-auto pr-2">
            <li>
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left py-1 px-2 border-l-2 hover:bg-kraft-light transition-colors ${
                  categoryParam === '' ? 'border-vintageRed font-bold text-vintageRed' : 'border-transparent'
                }`}
              >
                All Departments
              </button>
            </li>
            {categories.map((cat) => {
              const name = typeof cat === 'object' ? cat.name : cat;
              const slug = typeof cat === 'object' ? cat.slug : cat;
              return (
                <li key={slug}>
                  <button
                    onClick={() => handleCategorySelect(slug)}
                    className={`w-full text-left py-1 px-2 border-l-2 hover:bg-kraft-light transition-colors truncate ${
                      categoryParam === slug ? 'border-vintageRed font-bold text-vintageRed' : 'border-transparent'
                    }`}
                    title={name}
                  >
                    {name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Reset Filter Button */}
        {(categoryParam || searchParam) && (
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 border border-ledgerInk bg-paperWhite-dark hover:bg-kraft text-xs font-ledger font-bold py-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET FILTERS
          </button>
        )}
      </aside>

      {/* Main Ledger Content */}
      <section className="flex-grow">
        {/* Catalog Banner info */}
        <div className="border-2 border-ledgerInk bg-paperWhite px-6 py-4 mb-6 shadow-vintage flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-sm">
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight">LEDGER RECORD LIST</h1>
            <p className="text-xs font-ledger text-ledgerInk-light mt-1">
              Showing {products.length > 0 ? skip + 1 : 0} – {Math.min(skip + products.length, totalProducts)} of {totalProducts} general store items
            </p>
          </div>
          
          {/* Active filter badges */}
          {(categoryParam || searchParam) && (
            <div className="flex flex-wrap gap-2 text-xs font-ledger items-center">
              <span className="font-bold">Active filters:</span>
              {categoryParam && (
                <span className="px-2 py-0.5 border border-vintageRed text-vintageRed bg-paperWhite-light font-bold">
                  Dept: {categoryParam}
                </span>
              )}
              {searchParam && (
                <span className="px-2 py-0.5 border border-vintageRed text-vintageRed bg-paperWhite-light font-bold">
                  Query: "{searchParam}"
                </span>
              )}
            </div>
          )}
        </div>

        {/* Catalog Content States */}
        {loading ? (
          <div className="text-center py-20 border-2 border-dashed border-ledgerInk/30 bg-paperWhite/50">
            <span className="font-ledger font-bold animate-pulse text-lg">CONSULTING LEDGER BOOK...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20 border-2 border-vintageRed bg-paperWhite text-vintageRed p-8">
            <h3 className="font-display text-xl font-bold mb-2">CATALOG FAILED TO LOAD</h3>
            <p className="font-ledger mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="border border-vintageRed bg-vintageRed text-paperWhite hover:bg-vintageRed-dark px-4 py-2 font-ledger text-xs font-bold transition-colors"
            >
              TRY FETCHING AGAIN
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border-2 border-ledgerInk/30 bg-paperWhite p-8">
            <h3 className="font-display text-xl font-bold mb-2">NO REGISTERED WARES FOUND</h3>
            <p className="font-ledger text-sm text-ledgerInk-light mb-6">
              Our shelves are empty for this particular index code. Try resetting query parameters.
            </p>
            <button
              onClick={handleReset}
              className="border border-ledgerInk bg-vintageRed text-paperWhite hover:bg-vintageRed-dark px-4 py-2 font-ledger text-xs font-bold shadow-vintage-sm"
            >
              RESET CATALOG VIEW
            </button>
          </div>
        ) : (
          <>
            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="bg-paperWhite border-2 border-ledgerInk overflow-hidden shadow-vintage hover:-translate-y-0.5 hover:shadow-vintage-lg transition-all flex flex-col justify-between rounded-sm"
                >
                  <div>
                    {/* Image Area */}
                    <div className="h-48 border-b-2 border-ledgerInk bg-kraft-light relative flex items-center justify-center overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="object-contain h-full w-full p-4 mix-blend-multiply"
                        loading="lazy"
                      />
                      {/* Product Tag Category Badge */}
                      <span className="absolute top-2 right-2 bg-ledgerGrid text-ledgerInk-dark border border-ledgerInk px-2 py-0.5 text-[10px] font-ledger font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <span className="text-[10px] font-ledger text-ledgerInk-light">CODE: #{product.id.toString().padStart(4, '0')}</span>
                        {product.rating && (
                          <span className="text-[10px] font-ledger bg-paperWhite-dark border border-ledgerInk/20 px-1 py-0.5">★ {product.rating}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold font-display text-ledgerInk mb-2 line-clamp-1 leading-tight hover:text-vintageRed cursor-pointer"
                          onClick={() => navigate(`/product/${product.id}`)}>
                        {product.title}
                      </h3>
                      <p className="text-xs font-body text-ledgerInk-light line-clamp-2 min-h-[2rem]">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="border-t border-ledgerInk/20 p-4 bg-paperWhite-light flex items-center justify-between">
                    <div>
                      <span className="text-xs text-ledgerInk-light font-ledger block leading-none">PRICE</span>
                      <span className="text-lg font-bold font-ledger text-vintageRed">${product.price.toFixed(2)}</span>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="border border-ledgerInk bg-paperWhite hover:bg-kraft text-xs font-ledger font-bold py-2 px-3 shadow-vintage-sm hover:shadow-none transition-all"
                    >
                      VIEW LEDGER
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Grid */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4 font-ledger text-sm">
                <button
                  onClick={() => handlePageChange(pageParam - 1)}
                  disabled={pageParam === 1}
                  className="flex items-center gap-1 border border-ledgerInk bg-paperWhite hover:bg-kraft disabled:bg-paperWhite-dark/40 disabled:text-ledgerInk-light/50 px-3 py-2 shadow-vintage-sm disabled:shadow-none transition-all font-bold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  PREV PAGE
                </button>
                
                <span className="font-bold bg-paperWhite border border-ledgerInk px-4 py-2 shadow-vintage-sm">
                  SHEET {pageParam} OF {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pageParam + 1)}
                  disabled={pageParam === totalPages}
                  className="flex items-center gap-1 border border-ledgerInk bg-paperWhite hover:bg-kraft disabled:bg-paperWhite-dark/40 disabled:text-ledgerInk-light/50 px-3 py-2 shadow-vintage-sm disabled:shadow-none transition-all font-bold"
                >
                  NEXT PAGE
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
