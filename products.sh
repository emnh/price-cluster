./src/down.py | grep -o 'product.php?p=[0-9]*' | while read product; do
  c=0
  product2=$(echo $product | sed 's/p=/e=/')
  if ! [ -e products/$product.html ] || ! [ -e products/$product2.html ] || [ "$c" -eq "5235" ]; then
    echo $product
    google-chrome-stable --headless --disable-gpu --dump-dom 'https://www.prisjakt.no/'$product > products/$product.html
    echo $product2
    google-chrome-stable --headless --disable-gpu --dump-dom 'https://www.prisjakt.no/'$product2 > products/$product2.html
  fi
  sleep 1
done
