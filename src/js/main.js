import { arraysOptions } from './options';

//
// флаг для отслеживания состояния сортировки
let sortActive = true;
let sortingInProgress = false;
const mainPause = document.querySelector('.main__pause');

let currentArray = [];

mainPause.addEventListener('click', (e) => {
  if (sortActive) {
    sortActive = false;
    mainPause.textContent = 'Resume Sorting';
  } else {
    sortActive = true;
    mainPause.textContent = 'Pause Sorting';
    startSorting(false);
  }
});

//

function updateTable(arr) {
  const table = document.querySelector('.main__table');
  table.innerHTML = arr
    .map((item) => `<div class="main__item" style="height:${item * 5}px;"></div>`)
    .join('');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function swap(arr, i, j) {
  await sleep(50);
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
  updateTable(arr);
}

// Сортировка пузырьком
async function bubbleSort(arr) {
  let length = arr.length;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      if (!sortActive) return; // выход из функции, если сортировка остановлена
      if (arr[j] > arr[j + 1]) {
        await swap(arr, j, j + 1);
      }
    }
  }
}

// Сортировка выбором
async function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (!sortActive) return;
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      await swap(arr, i, minIndex);
    }
  }
}

//Сортировка вставками
async function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      if (!sortActive) return;
      arr[j + 1] = arr[j];
      j--;
      updateTable(arr);
      await sleep(100);
    }
    arr[j + 1] = current;
    updateTable(arr);
    await sleep(100);
  }
}

//Сортировка слиянием

async function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  if (!sortActive) return;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    await swap(arr, i, largest); // Assuming you have a swap function
    updateTable(arr);
    await sleep(100);

    await heapify(arr, n, largest);
  }
}

async function heapSort(arr) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (!sortActive) return;
    await heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    if (!sortActive) return;
    await swap(arr, 0, i);
    updateTable(arr); // Assuming you have a function to update the table
    await sleep(100);
    await heapify(arr, i, 0);
  }
}

//

async function countingSort(arr, min, max) {
  let i = min;
  let z = 0;
  const count = [];

  for (i; i <= max; i++) {
    count[i] = 0;
  }

  for (i = 0; i < arr.length; i++) {
    count[arr[i]] += 1;
  }

  for (i = min; i <= max; i++) {
    while (count[i] > 0) {
      arr[z] = i;
      z++;
      count[i]--;
      await sleep(50); // Добавляем задержку для визуализации
      updateTable(arr); // Обновляем отображение массива
    }
  }

  return arr;
}

//

const mainStart = document.querySelector('.main__start');

mainStart.addEventListener('click', (e) => startSorting(true));

async function startSorting(flag) {
  const algorithmSelect = document.getElementById('algorithmSelect');
  const selectedAlgorithm = algorithmSelect.value;
  // Получение выбранного массива
  const arraySelect = document.getElementById('arraySelect');
  const selectedArray = arraySelect.value;

  if (flag) {
    currentArray = [...arraysOptions[selectedArray]];
  }

  // Использование выбранного массива
  updateTable(currentArray);
  switch (selectedAlgorithm) {
    case 'bubbleSort':
      await bubbleSort(currentArray);
      break;
    case 'selectionSort':
      await selectionSort(currentArray);
      break;
    case 'insertionSort':
      await insertionSort(currentArray);
      break;
    case 'heapSort':
      await heapSort(currentArray);
      break;
    case 'countingSort':
      const min = Math.min(...currentArray);
      const max = Math.max(...currentArray);
      await countingSort(currentArray, min, max);
      break;
    default:
      console.log('Invalid algorithm selection');
  }
}
