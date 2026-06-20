import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Typography, Paper, Chip, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem,
  Card, CardMedia, CardContent,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { vehiclesApi, vehicleCategoriesApi, vehicleBrandsApi, vehicleModelsApi, type Vehicle } from '../../services/core'

const fuelLabels: Record<string, string> = { petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', hybrid: 'Hybrid' }
const transLabels: Record<string, string> = { manual: 'Manual', automatic: 'Automatic' }
const condLabels: Record<string, string> = { new: 'New', like_new: 'Like New', excellent: 'Excellent', good: 'Good', fair: 'Fair' }

export default function VehicleDetailPage() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const isEdit = pathname.endsWith('/edit')
  const isNew = id === 'new'

  useEffect(() => {
    if (id && !isNew && !isEdit) vehiclesApi.get(Number(id)).then(setVehicle)
    if (id && isEdit) vehiclesApi.get(Number(id)).then(setVehicle)
  }, [id])

  if (isNew || isEdit) return (
    <VehicleFormPage
      editVehicle={isEdit ? vehicle || undefined : undefined}
      onSave={() => navigate('/vehicles')}
    />
  )

  if (!vehicle) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Vehicle — {vehicle.vin}</Typography>
        <Box>
          <Button onClick={() => navigate(`/vehicles/${id}/edit`)} sx={{ mr: 1 }}>Edit</Button>
          <Button onClick={() => navigate('/vehicles')}>Back</Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Details</Typography>
            <Typography>VIN: {vehicle.vin}</Typography>
            <Typography>Reg: {vehicle.reg_number || '—'}</Typography>
            <Typography>Year: {vehicle.year}</Typography>
            <Typography>Mileage: {vehicle.mileage.toLocaleString()} mi</Typography>
            <Typography>Fuel: {fuelLabels[vehicle.fuel_type] || vehicle.fuel_type}</Typography>
            <Typography>Transmission: {transLabels[vehicle.transmission] || vehicle.transmission}</Typography>
            <Typography>Color: {vehicle.color || '—'}</Typography>
            <Typography>Condition: {condLabels[vehicle.condition] || vehicle.condition}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Pricing</Typography>
            <Typography variant="h5" color="primary">${parseFloat(vehicle.price).toLocaleString()}</Typography>
            <Chip label={vehicle.status} sx={{ mt: 1 }} />
            {vehicle.description && (
              <Typography sx={{ mt: 2 }}>{vehicle.description}</Typography>
            )}
          </Paper>
        </Grid>

        {vehicle.images.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Images</Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {vehicle.images.map((img) => (
                  <Card key={img.id} sx={{ width: 200 }}>
                    <CardMedia component="img" height={150} image={img.image} alt="" />
                    <CardContent sx={{ py: 1 }}>
                      <Typography variant="caption">{img.is_primary ? 'Primary' : `#${img.sort_order}`}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {vehicle.spec_values.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Specifications</Typography>
              {vehicle.spec_values.map((sv) => (
                <Typography key={sv.id}>Spec #{sv.specification}: {JSON.stringify(sv.value)}</Typography>
              ))}
            </Paper>
          </Grid>
        )}

        {vehicle.inspections.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Inspections</Typography>
              {vehicle.inspections.map((ins) => (
                <Box key={ins.id} sx={{ mb: 1 }}>
                  <Typography>Rating: {ins.rating}/5 — {ins.report}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        )}

        {vehicle.price_history.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Price History</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Old Price</TableCell><TableCell>New Price</TableCell><TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vehicle.price_history.map((ph) => (
                      <TableRow key={ph.id}>
                        <TableCell>${parseFloat(ph.old_price).toLocaleString()}</TableCell>
                        <TableCell>${parseFloat(ph.new_price).toLocaleString()}</TableCell>
                        <TableCell>{new Date(ph.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

function VehicleFormPage({ editVehicle, onSave }: { editVehicle?: Vehicle; onSave: () => void }) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [form, setForm] = useState({
    vin: '', reg_number: '', year: new Date().getFullYear(), mileage: 0,
    fuel_type: 'petrol', transmission: 'manual', color: '', condition: 'good',
    price: '', status: 'available', description: '', category: '', brand: '',
    model: '', showroom: '',
  })

  useEffect(() => {
    vehicleCategoriesApi.list().then(setCategories)
    vehicleBrandsApi.list().then(setBrands)
    if (editVehicle) {
      setForm({
        vin: editVehicle.vin, reg_number: editVehicle.reg_number,
        year: editVehicle.year, mileage: editVehicle.mileage,
        fuel_type: editVehicle.fuel_type, transmission: editVehicle.transmission,
        color: editVehicle.color, condition: editVehicle.condition,
        price: editVehicle.price, status: editVehicle.status,
        description: editVehicle.description,
        category: String(editVehicle.category || ''),
        brand: String(editVehicle.brand || ''),
        model: String(editVehicle.model || ''),
        showroom: String(editVehicle.showroom),
      })
    }
  }, [editVehicle])

  const handleBrandChange = async (brandId: string) => {
    setForm({ ...form, brand: brandId, model: '' })
    if (brandId) {
      const m = await vehicleModelsApi.list(Number(brandId))
      setModels(m)
    } else {
      setModels([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = {
      ...form,
      category: form.category ? Number(form.category) : null,
      brand: form.brand ? Number(form.brand) : null,
      model: form.model ? Number(form.model) : null,
      showroom: Number(form.showroom),
    }
    if (editVehicle) {
      await vehiclesApi.update(editVehicle.id, payload)
    } else {
      await vehiclesApi.create(payload)
    }
    onSave()
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h4" mb={2}>{editVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}><TextField fullWidth label="VIN" required value={form.vin}
          onChange={(e) => setForm({ ...form, vin: e.target.value })} /></Grid>
        <Grid size={{ xs: 6 }}><TextField fullWidth label="Reg Number" value={form.reg_number}
          onChange={(e) => setForm({ ...form, reg_number: e.target.value })} /></Grid>
        <Grid size={{ xs: 4 }}><TextField fullWidth label="Year" type="number" required value={form.year}
          onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /></Grid>
        <Grid size={{ xs: 4 }}><TextField fullWidth label="Mileage" type="number" value={form.mileage}
          onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })} /></Grid>
        <Grid size={{ xs: 4 }}><TextField fullWidth label="Price" required value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} /></Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth select label="Fuel Type" required value={form.fuel_type}
            onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}>
            {Object.entries(fuelLabels).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth select label="Transmission" required value={form.transmission}
            onChange={(e) => setForm({ ...form, transmission: e.target.value })}>
            {Object.entries(transLabels).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth select label="Condition" required value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}>
            {Object.entries(condLabels).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth select label="Status" required value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="sold">Sold</MenuItem>
            <MenuItem value="reserved">Reserved</MenuItem>
            <MenuItem value="in_transit">In Transit</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth select label="Category" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <MenuItem value="">—</MenuItem>
            {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth select label="Brand" value={form.brand}
            onChange={(e) => handleBrandChange(e.target.value)}>
            <MenuItem value="">—</MenuItem>
            {brands.map((b) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
          </TextField>
        </Grid>
        {models.length > 0 && (
          <Grid size={{ xs: 6 }}>
            <TextField fullWidth select label="Model" value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}>
              <MenuItem value="">—</MenuItem>
              {models.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
            </TextField>
          </Grid>
        )}
        <Grid size={{ xs: 6 }}><TextField fullWidth label="Color" value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })} /></Grid>
        <Grid size={{ xs: 12 }}><TextField fullWidth label="Description" multiline rows={3} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} /></Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" sx={{ mr: 1 }}>Save</Button>
          <Button onClick={() => navigate('/vehicles')}>Cancel</Button>
        </Grid>
      </Grid>
    </Box>
  )
}
