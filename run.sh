#!/bin/bash
for offset in `seq 0 36 684`; do

  c=$(wc -c data/$offset.html | cut -f1 -d' ')
  if ! [ -e data/$offset.html ] || [ "$c" -eq "5235" ]; then
    echo $offset
    google-chrome-stable --headless --disable-gpu --dump-dom 'https://www.prisjakt.no/c/stasjonaere-datamaskiner?sort=price&offset='$offset > data/$offset.html
  fi
  sleep 1
done
